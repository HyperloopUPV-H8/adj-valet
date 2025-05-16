import os
import json
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
    """
    Expects boards in the form:
      [ { "BoardA": { "board_id": ..., "board_ip": ..., "measurements": [...], "packets": [...] } }, ... ]
    This will overwrite each board’s main file and drop all measurements/packets
    into single JSON files under each board folder.
    """
    boards_root = os.path.join(adj_path, "boards")
    for board_wrapper in boards:
        board_name, board_obj = next(iter(board_wrapper.items()))
        board_dir = os.path.join(boards_root, board_name)
        if not os.path.isdir(board_dir):
            raise FileNotFoundError(f"Boards directory not found: {board_dir}")

        meas_path = os.path.join(board_dir, "measurements.json")
        with open(meas_path, "w", encoding="utf-8") as mf:
            json.dump(board_obj.get("measurements", []), mf, indent=2)

        pkt_path = os.path.join(board_dir, "packets.json")
        packets = [
            { **v } for pkt in board_obj.get("packets", [])
                   for v in [ pkt.get("packet_id", {}) ]
        ]
        with open(pkt_path, "w", encoding="utf-8") as pf:
            json.dump(packets, pf, indent=2)

        main_json_path = os.path.join(board_dir, f"{board_name}.json")
        with open(main_json_path, "r+", encoding="utf-8") as f:
            board_main = json.load(f)
            board_main["board_id"]   = board_obj.get("board_id")
            board_main["board_ip"]   = board_obj.get("board_ip")
            board_main["measurements"] = ["measurements.json"]
            board_main["packets"]      = ["packets.json"]
            f.seek(0)
            json.dump(board_main, f, indent=2)
            f.truncate()
