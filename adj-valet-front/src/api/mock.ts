import { ADJ } from "../types/ADJ";

export const ADJ_INFO_MOCK: ADJ = {
    general_info: {
        ports: { "HTTP": 80, "HTTPS": 443 },
        addresses: { "server": "192.168.1.1", "backup": "192.168.1.2" },
        units: { "temperature": "Celsius", "pressure": "Pascal" },
        message_ids: { "start": 1, "stop": 2 }
    },
    board_list: {
        OBCCU: "boards/OBCCU/OBCCU.json",
        VCU: "boards/VCU/VCU.json",
        LCU: "boards/LCU/LCU.json"
    },
    boards: [
        {
            "OBCCU": {
                board_id: 101,
                board_ip: "192.168.1.1",
                measurements: [
                    {
                        measurement_id: {
                            name: "Temperature Sensor",
                            type: "Analog",
                            podUnits: "C",
                            displayUnits: "Celsius",
                            enumValues: ["Low", "Medium", "High"],
                            safeRange: [0, 50],
                            warningRange: [51, 100]
                        }
                    }
                ],
                packets: [
                    {
                        packet_id: {
                            type: "Data",
                            name: "Sensor Data",
                            variables: [{ "temperature": "25" }, { "humidity": "60" }]
                        }
                    }
                ]
            }
        },
        {
            "VCU": {
                board_id: 102,
                board_ip: "192.168.1.2",
                measurements: [
                    {
                        measurement_id: {
                            name: "Pressure Sensor",
                            type: "Digital",
                            podUnits: "Pa",
                            displayUnits: "Pascal",
                            enumValues: ["Low", "Medium", "High"],
                            safeRange: [0, 1000],
                            warningRange: [1001, 2000]
                        }
                    }
                ],
                packets: [
                    {
                        packet_id: {
                            type: "Data",
                            name: "Sensor Data",
                            variables: [{ "pressure": "500" }, { "altitude": "100" }]
                        }
                    }
                ]
            }
        },
        {
            "LCU": {
                board_id: 103,
                board_ip: "192.168.1.3",
                measurements: [
                    {
                        measurement_id: {
                            name: "Humidity Sensor",
                            type: "Analog",
                            podUnits: "%",
                            displayUnits: "Percentage",
                            enumValues: ["Low", "Medium", "High"],
                            safeRange: [0, 70],
                            warningRange: [71, 100]
                        }
                    }
                ],
                packets: [
                    {
                        packet_id: {
                            type: "Data",
                            name: "Sensor Data",
                            variables: [{ "humidity": "45" }, { "temperature": "22" }]
                        }
                    }
                ]
            }
        }
    ]
};