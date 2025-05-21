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
        "variables": [
            {key: value} if isinstance(v, dict) and len(v) == 1 else {str(v): str(v)}
            for v in packet.get("variables", [])
            for key, value in (v.items() if isinstance(v, dict) else [(None, None)])
            if key is not None
        ]
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
            # Now, packet is a plain dict (not wrapped)
            if not isinstance(packet, dict):
                raise ValueError(f"Packet missing packet dict in board '{board_name}'")
            pkt_id = packet.get("id") or packet.get("name")
            if not pkt_id:
                raise ValueError(f"Packet missing both 'id' and 'name' in board '{board_name}'")
            if "id" not in packet and "name" in packet:
                packet["id"] = packet["name"]
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
