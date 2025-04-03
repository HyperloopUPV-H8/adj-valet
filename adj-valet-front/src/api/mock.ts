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
                        name: "Engine Temperature",
                        type: "Analog",
                        podUnits: "C",
                        displayUnits: "Celsius",
                        enumValues: ["Low", "Medium", "High"],
                        below: { safe: 50, warning: 20 },
                        above: { safe: 80, warning: 90 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "26",
                        name: "Oil Pressure",
                        type: "Digital",
                        podUnits: "Bar",
                        displayUnits: "Bar",
                        enumValues: ["Critical", "Normal", "High"],
                        below: { safe: 2, warning: 1 },
                        above: { safe: 5, warning: 6 },
                        out_of_range: [0, 8]
                    },
                    {
                        id: "27",
                        name: "Rotation Speed",
                        type: "Analog",
                        podUnits: "RPM",
                        displayUnits: "RPM",
                        enumValues: ["Slow", "Normal", "Fast"],
                        below: { safe: 1000, warning: 500 },
                        above: { safe: 3000, warning: 3500 },
                        out_of_range: [0, 4000]
                    },
                    {
                        id: "28",
                        name: "Fuel Level",
                        type: "Analog",
                        podUnits: "L",
                        displayUnits: "Liters",
                        enumValues: ["Empty", "Half", "Full"],
                        below: { safe: 20, warning: 10 },
                        above: { safe: 45, warning: 48 },
                        out_of_range: [0, 50]
                    },
                    {
                        id: "29",
                        name: "Battery Voltage",
                        type: "Analog",
                        podUnits: "V",
                        displayUnits: "Volts",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: 11.5, warning: 11 },
                        above: { safe: 14.5, warning: 15 },
                        out_of_range: [9, 16]
                    },
                    {
                        id: "30",
                        name: "Coolant Level",
                        type: "Digital",
                        podUnits: "%",
                        displayUnits: "Percent",
                        enumValues: ["Low", "OK", "High"],
                        below: { safe: 40, warning: 30 },
                        above: { safe: 80, warning: 90 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "31",
                        name: "Transmission Temperature",
                        type: "Analog",
                        podUnits: "C",
                        displayUnits: "Celsius",
                        enumValues: ["Cold", "Normal", "Hot"],
                        below: { safe: 60, warning: 40 },
                        above: { safe: 90, warning: 100 },
                        out_of_range: [20, 120]
                    },
                    {
                        id: "32",
                        name: "Boost Pressure",
                        type: "Analog",
                        podUnits: "PSI",
                        displayUnits: "PSI",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: 10, warning: 5 },
                        above: { safe: 20, warning: 25 },
                        out_of_range: [0, 30]
                    },
                    {
                        id: "33",
                        name: "Air Flow Rate",
                        type: "Analog",
                        podUnits: "g/s",
                        displayUnits: "Grams/Second",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: 15, warning: 10 },
                        above: { safe: 40, warning: 45 },
                        out_of_range: [5, 50]
                    },
                    {
                        id: "34",
                        name: "Oxygen Sensor",
                        type: "Digital",
                        podUnits: "V",
                        displayUnits: "Volts",
                        enumValues: ["Rich", "Optimal", "Lean"],
                        below: { safe: 0.7, warning: 0.5 },
                        above: { safe: 0.9, warning: 1.0 },
                        out_of_range: [0, 1.1]
                    },
                    {
                        id: "35",
                        name: "Throttle Position",
                        type: "Analog",
                        podUnits: "%",
                        displayUnits: "Percent",
                        enumValues: ["Closed", "Partial", "Full"],
                        below: { safe: 90, warning: 80 },
                        above: { safe: 20, warning: 10 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "36",
                        name: "Brake Fluid Level",
                        type: "Digital",
                        podUnits: "%",
                        displayUnits: "Percent",
                        enumValues: ["Low", "OK", "Full"],
                        below: { safe: 50, warning: 40 },
                        above: { safe: 90, warning: 95 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "37",
                        name: "Cabin Temperature",
                        type: "Analog",
                        podUnits: "C",
                        displayUnits: "Celsius",
                        enumValues: ["Cold", "Comfort", "Hot"],
                        below: { safe: 18, warning: 15 },
                        above: { safe: 25, warning: 28 },
                        out_of_range: [10, 35]
                    },
                    {
                        id: "38",
                        name: "Wind Speed",
                        type: "Analog",
                        podUnits: "km/h",
                        displayUnits: "Kilometers/Hour",
                        enumValues: ["Calm", "Moderate", "Strong"],
                        below: { safe: 30, warning: 20 },
                        above: { safe: 60, warning: 70 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "39",
                        name: "Tire Pressure",
                        type: "Digital",
                        podUnits: "PSI",
                        displayUnits: "PSI",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: 30, warning: 25 },
                        above: { safe: 35, warning: 40 },
                        out_of_range: [20, 45]
                    },
                    {
                        id: "40",
                        name: "Oil Temperature",
                        type: "Analog",
                        podUnits: "C",
                        displayUnits: "Celsius",
                        enumValues: ["Cold", "Normal", "Hot"],
                        below: { safe: 70, warning: 60 },
                        above: { safe: 100, warning: 110 },
                        out_of_range: [40, 120]
                    },
                    {
                        id: "41",
                        name: "Humidity Level",
                        type: "Analog",
                        podUnits: "%",
                        displayUnits: "Percent",
                        enumValues: ["Dry", "Normal", "Humid"],
                        below: { safe: 30, warning: 20 },
                        above: { safe: 60, warning: 70 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "42",
                        name: "Acceleration",
                        type: "Analog",
                        podUnits: "m/s²",
                        displayUnits: "Meters/Second²",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: -2, warning: -3 },
                        above: { safe: 2, warning: 3 },
                        out_of_range: [-5, 5]
                    },
                    {
                        id: "43",
                        name: "Engine Load",
                        type: "Analog",
                        podUnits: "%",
                        displayUnits: "Percent",
                        enumValues: ["Light", "Normal", "Heavy"],
                        below: { safe: 60, warning: 50 },
                        above: { safe: 80, warning: 90 },
                        out_of_range: [0, 100]
                    },
                    {
                        id: "44",
                        name: "Battery Current",
                        type: "Analog",
                        podUnits: "A",
                        displayUnits: "Amperes",
                        enumValues: ["Low", "Normal", "High"],
                        below: { safe: -10, warning: -15 },
                        above: { safe: 40, warning: 50 },
                        out_of_range: [-20, 60]
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