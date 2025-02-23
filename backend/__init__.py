ADJ_PATH = "./adj/"

ADJ = {
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

GENERAL_INFO = {
    "ports": {str:int},
    "addresses": {str:str},
    "units":{str:str},
    "message_ids": {str:int}
}

BOARDS = {str:str}

BOARD_MAIN = {
    "board_id":int,
    "board_ip":int,
    "measurements":[str],
    "packets":[str]
}

MEASUREMENTS = {
    "measurements":[{
        "id":str,
        "name":str,
        "type":str,
        "podUnits":str,
        "displayUnits":str,
        "enumValues":[str],
        "safeRange": [int],
        "warningRange":[int]
    }]
}

PACKETS = {
    "packets":[{
        "id":str,
        "type":str,
        "name":str,
        "variables":[{str:str}]
    }]
}
