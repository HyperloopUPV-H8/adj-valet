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
                            id: "25",
                            name: "Temperature Sensor",
                            type: "Analog",
                            podUnits: "C",
                            displayUnits: "Celsius",
                            enumValues: ["Low", "Medium", "High"],
                            below: {
                                safe: 50,
                                warning: 20
                            },
                            above: {
                                safe: 30,
                                warning: 40
                            },
                            out_of_range: [10, 60]
                    }
                ],
                packets: [
                    {
                        "05": {
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
                        id: "105",
                        name: "Pressure Sensor",
                        type: "Digital",
                        podUnits: "Pa",
                        displayUnits: "Pascal",
                        enumValues: ["Low", "Medium", "High"],
                        above: {
                            safe: 1000,
                            warning: 2000
                        },
                        below: {
                            safe: 500,
                            warning: 100
                        },
                        out_of_range: [0, 3000]
                    }
                ],
                packets: [
                    {
                        "302": {
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
                        id: "100",
                        name: "Humidity Sensor",
                        type: "Analog",
                        podUnits: "%",
                        displayUnits: "Percentage",
                        enumValues: ["Low", "Medium", "High"],
                        above: {
                            safe: 60,
                            warning: 80
                        },
                        below: {
                            safe: 20,
                            warning: 40
                        },
                        out_of_range: [0, 100]
                    }
                ],
                packets: [
                    {
                        "200": {
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