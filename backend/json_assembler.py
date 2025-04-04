from typing import Any, Dict, List
from data_ingestion import read_general_info, read_board_list, read_board_data

def transform_measurement(meas: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": meas.get("id"),
        "name": meas.get("name"),
        "type": meas.get("type"),
        "podUnits": meas.get("podUnits", ""),
        "displayUnits": meas.get("displayUnits", ""),
        "enumValues": meas.get("enumValues", []),
        "safeRange": [
            meas.get("below", {}).get("safe", 0),
            meas.get("above", {}).get("safe", 0)
        ],
        "warningRange": [
            meas.get("below", {}).get("warning", 0),
            meas.get("above", {}).get("warning", 0)
        ],
    }

def transform_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "type": packet.get("type"),
        "name": packet.get("name"),
        "variables": [{v: v} for v in packet.get("variables", [])]
    }

def assemble_monojson(adj_path: str) -> Dict[str, Any]:
    monojson: Dict[str, Any] = {
        "general_info": read_general_info(adj_path),
        "board_list": read_board_list(adj_path),
        "boards": []
    }
    boards = read_board_data(adj_path)
    for board_name, board in boards.items():
        transformed_measurements: List[Dict[str, Any]] = []
        for meas in board.get("measurements", []):
            if "id" not in meas:
                raise ValueError(f"Measurement missing 'id' in board '{board_name}'")
            transformed_measurements.append(transform_measurement(meas))
        transformed_packets: List[Dict[str, Any]] = []
        for packet in board.get("packets", []):
            if "id" not in packet:
                raise ValueError(f"Packet missing 'id' in board '{board_name}'")
            transformed_packets.append({"packet_id": transform_packet(packet)})
        monojson["boards"].append({
            board_name: {
                "board_id": board.get("board_id"),
                "board_ip": board.get("board_ip"),
                "measurements": transformed_measurements,
                "packets": transformed_packets
            }
        })
    return monojson
