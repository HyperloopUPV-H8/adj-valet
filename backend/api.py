import os
from typing import Dict, List, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from path import ADJ_PATH
from json_assembler import assemble_monojson
from diff_merge import merge_changes
from file_writer import save_general_info, save_board_list, save_boards

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/path")
async def set_adj_path(request: Request):
    data = await request.json()
    if "path" not in data or not isinstance(data["path"], str):
        raise HTTPException(status_code=400, detail="Missing or invalid 'path'.")
    ADJ_PATH.value = data["path"]
    return {"message": "ADJ_PATH set successfully", "path": ADJ_PATH.value}

@app.get("/assemble")
async def assemble_json():
    if ADJ_PATH.value is None:
        raise HTTPException(status_code=400, detail="ADJ_PATH is not set.")
    monojson = assemble_monojson(ADJ_PATH.value)
    return monojson

def detect_board_renames(old_boards: List[Dict[str, Any]], new_boards: List[Dict[str, Any]]) -> Dict[str, str]:
    """Detect board renames by matching board_id between old and new lists"""
    renames = {}

    # Create mappings of board_id to board_name
    old_mapping = {}
    for board in old_boards:
        board_name = list(board.keys())[0]
        board_data = board[board_name]
        # Skip boards without board_id
        if "board_id" not in board_data:
            continue
        board_id = board_data["board_id"]
        old_mapping[board_id] = board_name

    new_mapping = {}
    for board in new_boards:
        board_name = list(board.keys())[0]
        board_data = board[board_name]
        # Skip boards without board_id
        if "board_id" not in board_data:
            continue
        board_id = board_data["board_id"]
        new_mapping[board_id] = board_name

    # Find renames by matching board_ids with different names
    for board_id, old_name in old_mapping.items():
        if board_id in new_mapping:
            new_name = new_mapping[board_id]
            if old_name != new_name:
                renames[old_name] = new_name

    return renames

@app.post("/update")
async def update_json(request: Request):
    updated_fields = await request.json()
    if ADJ_PATH.value is None:
        raise HTTPException(status_code=400, detail="ADJ_PATH is not set.")

    # Validate and normalize updated fields
    if "boards" in updated_fields:
        for board in updated_fields["boards"]:
            for board_name, board_data in board.items():
                # Accept full definitions for measurements and packets
                if "measurements" not in board_data or not isinstance(board_data["measurements"], list) or not board_data["measurements"]:
                    raise HTTPException(status_code=400, detail=f"Board '{board_name}' has empty or invalid 'measurements'.")
                if "packets" not in board_data or not isinstance(board_data["packets"], list) or not board_data["packets"]:
                    raise HTTPException(status_code=400, detail=f"Board '{board_name}' has empty or invalid 'packets'.")
                for packet in board_data["packets"]:
                    if not isinstance(packet, dict) or "packet_id" not in packet or not isinstance(packet["packet_id"], dict):
                        raise HTTPException(status_code=400, detail=f"Invalid packet structure in board '{board_name}'.")
                # Normalize board_ip as string
                if "board_ip" in board_data and not isinstance(board_data["board_ip"], str):
                    board_data["board_ip"] = str(board_data["board_ip"])

    try:
        current_json = assemble_monojson(ADJ_PATH.value)
    except Exception as e:
        print(f"Warning: Error assembling current monojson: {e}")
        # Create a minimal current_json if assembly fails
        current_json = {
            "general_info": {},
            "board_list": {},
            "boards": []
        }
    
    new_json = merge_changes(current_json, updated_fields)

    # Detect board renames before saving
    renames = detect_board_renames(current_json.get("boards", []), new_json.get("boards", []))

    # Handle board renames by moving directories
    if renames:
        boards_root = os.path.join(ADJ_PATH.value, "boards")
        for old_name, new_name in renames.items():
            old_dir = os.path.join(boards_root, old_name)
            new_dir = os.path.join(boards_root, new_name)
            if os.path.exists(old_dir) and not os.path.exists(new_dir):
                os.rename(old_dir, new_dir)
                # Rename the main board JSON file
                old_json = os.path.join(new_dir, f"{old_name}.json")
                new_json_path = os.path.join(new_dir, f"{new_name}.json")
                if os.path.exists(old_json):
                    os.rename(old_json, new_json_path)
                # Rename the measurements file
                old_meas = os.path.join(new_dir, f"{old_name}_measurements.json")
                new_meas = os.path.join(new_dir, f"{new_name}_measurements.json")
                if os.path.exists(old_meas):
                    os.rename(old_meas, new_meas)

    # Update board_list to match boards
    updated_board_list = {}
    for board in new_json["boards"]:
        board_name = list(board.keys())[0]
        board_data = board[board_name]
        # Only add to board_list if board has an ID
        if "board_id" in board_data:
            board_id = str(board_data["board_id"])
            updated_board_list[board_id] = board_name
    new_json["board_list"] = updated_board_list

    # Persist merged changes back into ADJ folder
    save_general_info(ADJ_PATH.value, new_json["general_info"])
    save_board_list(   ADJ_PATH.value, new_json["board_list"])
    save_boards(       ADJ_PATH.value, new_json["boards"])

    return assemble_monojson(ADJ_PATH.value)
