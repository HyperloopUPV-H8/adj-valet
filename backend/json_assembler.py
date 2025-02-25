from typing import Any, Dict, List
from data_ingestion import read_general_info, read_board_list, read_board_data

def transform_measurement(meas: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform a measurement from its file format into the MonoJSON format.
    Expected file fields:
        - id, name, type, podUnits, displayUnits, enumValues,
          above: {safe, warning}, below: {safe, warning}
    Maps to:
        - name, type, podUnits, displayUnits, enumValues,
          safeRange: [below.safe, above.safe],
          warningRange: [below.warning, above.warning]
    """
    return {
        "name": meas["name"],
        "type": meas["type"],
        "podUnits": meas["podUnits"],
        "displayUnits": meas["displayUnits"],
        "enumValues": meas["enumValues"],
        "safeRange": [meas["below"]["safe"], meas["above"]["safe"]],
        "warningRange": [meas["below"]["warning"], meas["above"]["warning"]],
    }

def transform_packet(packet: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform a packet from its file format into the MonoJSON format.
    Expected file fields:
        - id, type, name, variables (list of strings)
    Maps to:
        - type, name, variables: converted to a list of single-key dicts.
    """
    return {
        "type": packet["type"],
        "name": packet["name"],
        "variables": [{v: v} for v in packet.get("variables", [])]
    }

def assemble_monojson(adj_path: str) -> Dict[str, Any]:
    """
    Assemble the final MonoJSON from the global files and board-specific data.
    Structure:
    {
        "general_info": { ... },
        "board_list": { ... },
        "boards": [
            {
                "<board_name>": {
                    "board_id": uint16,
                    "board_ip": str,
                    "measurements": [ { "<measurement_id>": { ... } }, ... ],
                    "packets": [ { "<packet_id>": { ... } }, ... ]
                }
            },
            ...
        ]
    }
    """
    monojson: Dict[str, Any] = {
        "general_info": read_general_info(adj_path),
        "board_list": read_board_list(adj_path),
        "boards": []
    }

    boards = read_board_data(adj_path)
    for board_name, board in boards.items():
        # Transform measurements
        transformed_measurements: List[Dict[str, Any]] = []
        for meas in board.get("measurements", []):
            if "id" not in meas:
                raise ValueError(f"Measurement missing 'id' in board '{board_name}'")
            transformed_measurements.append({ meas["id"]: transform_measurement(meas) })

        # Transform packets
        transformed_packets: List[Dict[str, Any]] = []
        for packet in board.get("packets", []):
            if "id" not in packet:
                raise ValueError(f"Packet missing 'id' in board '{board_name}'")
            transformed_packets.append({ str(packet["id"]): transform_packet(packet) })

        monojson["boards"].append({
            board_name: {
                "board_id": board["board_id"],
                "board_ip": board["board_ip"],
                "measurements": transformed_measurements,
                "packets": transformed_packets
            }
        })
    return monojson
