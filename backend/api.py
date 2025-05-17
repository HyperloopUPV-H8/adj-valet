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
    print(monojson)
    return monojson

@app.post("/update")
async def update_json(request: Request):
    updated_fields = await request.json()
    if ADJ_PATH.value is None:
        raise HTTPException(status_code=400, detail="ADJ_PATH is not set.")
    current_json = assemble_monojson(ADJ_PATH.value)
    new_json = merge_changes(current_json, updated_fields)

    # Persist merged changes back into ADJ folder
    save_general_info(ADJ_PATH.value, new_json["general_info"])
    save_board_list(   ADJ_PATH.value, new_json["board_list"])
    save_boards(       ADJ_PATH.value, new_json["boards"])

    return assemble_monojson(ADJ_PATH.value)
