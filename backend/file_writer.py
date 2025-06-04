import os
import json
import shutil
from typing import Any, Dict, List

def save_general_info(adj_path: str, general_info: Dict[str, Any]) -> None:
    path = os.path.join(adj_path, "general_info.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(general_info, f, indent=2)

def save_board_list(adj_path: str, board_list: Dict[str, str]) -> None:
    path = os.path.join(adj_path, "boards.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(board_list, f, indent=2)

def save_boards(adj_path: str, boards: List[Dict[str, Any]]) -> None:
    boards_root = os.path.join(adj_path, "boards")
    
    # Get list of existing board directories
    existing_dirs = set()
    if os.path.exists(boards_root):
        existing_dirs = set(d for d in os.listdir(boards_root) 
                           if os.path.isdir(os.path.join(boards_root, d)))
    
    # Track which directories are in use
    current_dirs = set()
    
    for board_wrapper in boards:
        board_name, board_obj = next(iter(board_wrapper.items()))
        board_dir = os.path.join(boards_root, board_name)
        current_dirs.add(board_name)
        
        if not os.path.isdir(board_dir):
            # Create the board directory for new boards
            os.makedirs(board_dir, exist_ok=True)

        # Always write measurements to <BOARD_NAME>_measurements.json
        measurements = board_obj.get("measurements", [])
        meas_file = f"{board_name}_measurements.json"
        meas_path = os.path.join(board_dir, meas_file)
        with open(meas_path, "w", encoding="utf-8") as mf:
            json.dump(measurements, mf, indent=2)

        # Split packets into packets.json (type 'data') and orders.json (type 'order')
        packets = [pkt["packet_id"] for pkt in board_obj.get("packets", []) if "packet_id" in pkt]
        data_packets = [pkt for pkt in packets if pkt.get("type") == "data"]
        order_packets = [pkt for pkt in packets if pkt.get("type") == "order"]

        packet_files = []
        if data_packets:
            pkt_file = "packets.json"
            pkt_path = os.path.join(board_dir, pkt_file)
            with open(pkt_path, "w", encoding="utf-8") as pf:
                json.dump(data_packets, pf, indent=2)
            packet_files.append(pkt_file)
        if order_packets:
            ord_file = "orders.json"
            ord_path = os.path.join(board_dir, ord_file)
            with open(ord_path, "w", encoding="utf-8") as of:
                json.dump(order_packets, of, indent=2)
            packet_files.append(ord_file)

        # Update the board’s main JSON to point at these files + id/ip
        main_json_path = os.path.join(board_dir, f"{board_name}.json")
        with open(main_json_path, "r+", encoding="utf-8") as f:
            board_main = json.load(f)
            board_main["board_id"]       = board_obj.get("board_id")
            board_main["board_ip"]       = board_obj.get("board_ip")
            board_main["measurements"]   = [meas_file]
            board_main["packets"]        = packet_files
            f.seek(0)
            json.dump(board_main, f, indent=2)
            f.truncate()
