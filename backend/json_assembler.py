from typing import Any, Dict, List
from data_ingestion import read_general_info, read_board_list, read_board_data

def transform_measurement(meas: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transform a measurement from its file format into the MonoJSON format.
    Expected file fields:
        - id, name, type, podUnits, displayUnits, enumValues,
          above: {safe, warning}, below: {safe, warning}
    Maps to a measurement object:
        {
            "id": int,
            "name": str,
            "type": str,
            "podUnits": str,
            "displayUnits": str,
            "enumValues": [str],
            "safeRange": [int, int],
            "warningRange": [int, int]
        }
    """
    return {
        "id": meas["id"],
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
    Maps to a packet details object.
    Note: In the final JSON, each packet is nested under the literal key "packet_id".
    """
    return {
        "type": packet["type"],
        "name": packet["name"],
        "variables": [{v: v} for v in packet.get("variables", [])]
    }

def assemble_monojson(adj_path: str) -> Dict[str, Any]:
    """
    Assemble the final MonoJSON from the global files and board-specific data.
    The resulting structure:

    {
        "general_info": { ... },
        "board_list": { ... },
        "boards": [
            {
                "<board_name>": {
                    "board_id": int,
                    "board_ip": int,
                    "measurements": [
                        {
                            "id": int,
                            "name": str,
                            "type": str,
                            "podUnits": str,
                            "displayUnits": str,
                            "enumValues": [str],
                            "safeRange": [int, int],
                            "warningRange": [int, int]
                        },
                        ...
                    ],
                    "packets": [
                        {
                            "packet_id": {
                                "type": str,
                                "name": str,
                                "variables": [{str:str}]
                            }
                        },
                        ...
                    ]
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
        # Transform measurements into a list of measurement objects.
        transformed_measurements: List[Dict[str, Any]] = []
        for meas in board.get("measurements", []):
            if "id" not in meas:
                raise ValueError(f"Measurement missing 'id' in board '{board_name}'")
            transformed_measurements.append(transform_measurement(meas))

        # Transform packets into a list of dictionaries with key "packet_id".
        transformed_packets: List[Dict[str, Any]] = []
        for packet in board.get("packets", []):
            if "id" not in packet:
                raise ValueError(f"Packet missing 'id' in board '{board_name}'")
            transformed_packets.append({"packet_id": transform_packet(packet)})

        monojson["boards"].append({
            board_name: {
                "board_id": board["board_id"],
                "board_ip": board["board_ip"],
                "measurements": transformed_measurements,
                "packets": transformed_packets
            }
        })
    return monojson
