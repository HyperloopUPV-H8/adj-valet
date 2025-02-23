export const ADJ_INFO_MOCK = {
    general_info: {
        ports: { "HTTP": 80, "HTTPS": 443 },
        addresses: { "server": "192.168.1.1", "backup": "192.168.1.2" },
        units: { "temperature": "Celsius", "pressure": "Pascal" },
        message_ids: { "start": 1, "stop": 2 }
    },
    board_list: { "main": "Board A", "secondary": "Board B" },
    boards: [
        {
            "board_1": {
                board_id: 101,
                board_ip: 19216811,
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
        }
    ]
};