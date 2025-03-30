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
                        id: "05",
                        type: "Data",
                        name: "Sensor Data",
                        variables: ["Temperature Sensor"]
                    },
                    {
                        id: "06", 
                        type: "Control",
                        name: "Temperature Control",
                        variables: ["Temperature Sensor"]
                    },
                    {
                        id: "07",
                        type: "Status",
                        name: "System Status",
                        variables: ["Temperature Sensor"]
                    },
                    {
                        id: "08",
                        type: "Diagnostic",
                        name: "Temperature Diagnostics",
                        variables: ["Temperature Sensor"]
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
                        id: "302",
                        type: "Data", 
                        name: "Pressure Data",
                        variables: ["Pressure Sensor"]
                    },
                    {
                        id: "303",
                        type: "Data",
                        name: "Control Data",
                        variables: ["Pressure Sensor"]
                    },
                    {
                        id: "304", 
                        type: "Data",
                        name: "Monitoring Data",
                        variables: ["Pressure Sensor"]
                    },
                    {
                        id: "305",
                        type: "Data",
                        name: "Diagnostic Data",
                        variables: ["Pressure Sensor"]
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
                        id: "200",
                        type: "Data",
                        name: "Sensor Data", 
                        variables: ["Humidity Sensor"]
                    },
                    {
                        id: "201",
                        type: "Data",
                        name: "Control Status",
                        variables: ["Humidity Sensor"]
                    },
                    {
                        id: "202",
                        type: "Data",
                        name: "System Metrics",
                        variables: ["Humidity Sensor"]
                    },
                    {
                        id: "203",
                        type: "Data",
                        name: "Performance Data",
                        variables: ["Humidity Sensor"]
                    }
                ]
            }
        }
    ]
};