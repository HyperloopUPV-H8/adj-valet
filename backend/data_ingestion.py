import json
import os
from typing import Any, Dict, List

def read_general_info(adj_path: str) -> Dict[str, Any]:
    """Load general info from ADJ/general_info.json."""
    general_info_path = os.path.join(adj_path, "general_info.json")
    if not os.path.isfile(general_info_path):
        raise FileNotFoundError(f"General info file not found: {general_info_path}")
    with open(general_info_path, 'r') as f:
        return json.load(f)

def read_board_list(adj_path: str) -> Dict[str, str]:
    """Load board list from ADJ/boards.json."""
    boards_list_path = os.path.join(adj_path, "boards.json")
    if not os.path.isfile(boards_list_path):
        raise FileNotFoundError(f"Boards list file not found: {boards_list_path}")
    with open(boards_list_path, 'r') as f:
        return json.load(f)

def read_board_data(adj_path: str) -> Dict[str, Dict[str, Any]]:
    """
    For each board in ADJ/boards, load the board main JSON and then
    read measurements and packets files using the relative paths specified.
    """
    boards_dir = os.path.join(adj_path, "boards")
    board_data: Dict[str, Dict[str, Any]] = {}
    if not os.path.isdir(boards_dir):
        raise FileNotFoundError(f"Boards directory not found: {boards_dir}")

    for board_name in os.listdir(boards_dir):
        board_folder = os.path.join(boards_dir, board_name)
        if not os.path.isdir(board_folder):
            continue

        # Load board main JSON
        board_main_file = os.path.join(board_folder, f"{board_name}.json")
        if not os.path.isfile(board_main_file):
            raise FileNotFoundError(f"Board main file not found: {board_main_file}")
        with open(board_main_file, 'r') as f:
            board_main = json.load(f)

        # Process measurements: each relative path points to a file with an array of measurements.
        measurements: List[Any] = []
        for rel_path in board_main.get("measurements", []):
            meas_file = os.path.join(board_folder, rel_path)
            if not os.path.isfile(meas_file):
                raise FileNotFoundError(f"Measurement file not found: {meas_file}")
            with open(meas_file, 'r') as mf:
                meas_data = json.load(mf)
                if isinstance(meas_data, list):
                    measurements.extend(meas_data)
                else:
                    raise ValueError(f"Expected a list in measurement file: {meas_file}")
        board_main["measurements"] = measurements

        # Process packets: each relative path points to a file with an array of packets.
        packets: List[Any] = []
        for rel_path in board_main.get("packets", []):
            packet_file = os.path.join(board_folder, rel_path)
            if not os.path.isfile(packet_file):
                raise FileNotFoundError(f"Packet file not found: {packet_file}")
            with open(packet_file, 'r') as pf:
                packet_data = json.load(pf)
                if isinstance(packet_data, list):
                    packets.extend(packet_data)
                else:
                    raise ValueError(f"Expected a list in packet file: {packet_file}")
        board_main["packets"] = packets

        board_data[board_name] = board_main

    return board_data
