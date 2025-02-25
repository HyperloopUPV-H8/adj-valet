# ADJ-Valet Backend

## API specification

This API allows clients to manage and retrieve the full initial JSON state assembled from the ADJ directory structure. It supports setting the base path, assembling the complete JSON, and updating it with modified fields from the frontend.

### Base URL

All endpoints are relative to the base URL where the application is hosted (e.g., http://localhost:8000).

### Endpoints

#### POST /path

Sets the global ADJ_PATH used by the application. The client must supply a JSON payload with the key path pointing to the directory containing the JSON files.

**Request**

Header: `Content-Type: application/json`

Body Example:

```json
{
    "path": "/absolute/path/to/ADJ"
}
```

**Response**

Status Code: `200 OK`

Body Example:

```json
{
    "message": "ADJ_PATH set successfully",
    "path": "/absolute/or/relative/path/to/ADJ"
}
```

**Errors**

`400 Bad Request`: If the `path` field is missing or not a string.

#### POST /assemble

Assembles the complete JSON (MonoJSON) from the provided directory structure. This endpoint aggregates global data (`general_info.json` and `boards.json`) as well as board-specific JSON files (including measurements and packets) into a single comprehensive JSON document.

**Request**

Heades: `Content-Type: application/json`

Body: None

**Response**

Status Code: `200 OK`

Body Example:

```json
{
    "general_info": {
        "ports": { "port1": 1234 },
        "addresses": { "address1": "192.168.1.1" },
        "units": { "unit1": "m/s" },
        "message_ids": { "msg1": 1 }
    },
    "board_list": { "BoardA": "BoardA", "BoardB": "BoardB" },
    "boards": [
        {
            "BoardA": {
                "board_id": 1,
                "board_ip": "192.168.1.101",
                "measurements": [
                    {
                        "M1": {
                            "name": "Temperature",
                            "type": "uint8",
                            "podUnits": "Celsius",
                            "displayUnits": "°C",
                            "enumValues": [],
                            "safeRange": [20.0, 80.0],
                            "warningRange": [15.0, 85.0]
                        }
                    }
                ],
                "packets": [
                    {
                        "100": {
                            "type": "data",
                            "name": "Packet1",
                            "variables": [
                                { "var1": "value1" }
                            ]
                        }
                    }
                ]
            }
        },
        {
            "BoardB": {
                "board_id": 2,
                "board_ip": "192.168.1.102",
                "measurements": [ /* ... */ ],
                "packets": [ /* ... */ ]
            }
        }
    ]
}
```

**Errors**

`400 Bad Request`: If the `ADJ_PATH` has not been set before calling `/assemble`.

#### POST /update

Updates the current MonoJSON with modified fields sent from the frontend. The request should include only the changed fields, and the server will merge these changes into the complete JSON structure.

**Request**

Headers: `Content-Type: application/json`

Body Example:
```json
{
    "general_info": {
        "ports": { "port1": 4321 }
    },
    "boards": [
        {
            "BoardA": {
                "packets": [
                    {
                        "100": {
                            "name": "Updated Packet Name"
                        }
                    }
                ]
            }
        }
    ]
}
```

**Response**

Status Code: `200 OK`

Body: The fully updated MonoJSON, reflecting the merged changes.

**Errors**

`400 Bad Request`: If the `ADJ_PATH` has not been set before calling `/update`.

## JSON specification

Path

```json
{
    "path" := str
}
```

MonoJSON

```json
{
    "general_info": {
        "ports": {str:int},
        "addresses": {str:str},
        "units":{str:str},
        "message_ids": {str:int}
    },
    "board_list": {str:str},
    "boards": [{
        str:{
            "board_id":int,
            "board_ip":int,
            "measurements":[{
                "measurement_id":{
                    "name":str,
                    "type":str,
                    "podUnits":str,
                    "displayUnits":str,
                    "enumValues":[str],
                    "safeRange": [int],
                    "warningRange":[int]
                }
            }],
            "packets":[{
                "packet_id":{
                    "type":str,
                    "name":str,
                    "variables":[{str:str}]
                }
            }]
        }
    }]
}
```

General Info

```json
{
    "ports": {str:int},
    "addresses": {str:str},
    "units":{str:str},
    "message_ids": {str:int}
}
```

Boards list

```json
{
    str:str
}
```

Board

```json
{
    "board_id":uint16,
    "board_ip":str,
    "measurements":[str],
    "packets":[str]
}
```

Measurements file

```json
[{
        "id":str,
        "name":str,
        "type":str <uint8|uint16|uint32|uint64|int8|int16|int32|int64|float32|float64>,
        "podUnits":str <general_info/units>,
        "displayUnits":str <general_info/units>,
        "enumValues":[str],
        "above": {
            "safe": float64
            "warning": float64
        },
        "below": {
            "safe": float64
            "warning": float64
        },
        "out_of_range": [float64, float64]
}]
```

Packets file

```json
[{
        "id":uint16,
        "type":str,
        "name":str,
        "variables":[str]
}]
```
