/**
 * @fileoverview Central state store for the ADJ-Valet application using Zustand
 */

import { create } from 'zustand';
import { ADJ } from '../types/ADJ';
import { Board, BoardInfo, BoardName } from '../types/Board';
import { Measurement, Range } from '../types/Measurement';
import { GeneralInfo } from '../types/GeneralInfo';
import { Packet } from '../types/Packet';

const STORAGE_KEY = 'adj_store';

/**
 * Interface that defines the store structure and methods
 * @interface Store
 */
interface Store {
    /** General ADJ information */
    general_info: GeneralInfo;
    /** List of boards */
    boards: Board[];
    /** Mapping of board names to their identifiers */
    board_list: Record<string, string>;

    /** Assembles and returns the complete ADJ object */
    assembleADJ: () => ADJ;
    /** Sets the complete store state */
    setADJStore: (ADJ: ADJ) => void;
    /** Updates a specific field of a board */
    updateBoard: (
        boardName: BoardName,
        field: keyof Board,
        value: string,
    ) => void;
    /** Removes a board */
    removeBoard: (boardName: BoardName) => void;
    /** Adds a new board */
    addBoard: (boardName: BoardName, boardInfo: BoardInfo) => void;
    /** Add a new measurement to a board */
    addMeasurement: (
        boardName: BoardName,
        measurement: Measurement,
    ) => void;
    /** Remove a measurement from a board */
    removeMeasurement: (
        boardName: BoardName,
        measurementId: string,
    ) => void;
    /** Updates a specific field of a measurement */
    updateMeasurement: (
        boardName: BoardName,
        measurementId: string,
        field: keyof Measurement,
        value: unknown,
    ) => void;
    /** Add packet to a board */
    addPacket: (
        boardName: BoardName,
        packet: Packet,
    ) => void;
    /** Remove packet from a board */
    removePacket: (
        boardName: BoardName,
        packetId: string,
    ) => void;
    /** Updates a specific field of a packet */
    updatePacketField: (
        boardName: BoardName,
        packetId: string,
        field: keyof Packet,
        value: unknown,
    ) => void;
    /** Updates a specific field of a measurement range */
    updateRange: (
        boardName: BoardName,
        measurementId: string,
        range: 'above' | 'below',
        field: keyof Range,
        value: string
    ) => void;
    /** Updates a field in the general information */
    updateGeneralInfoField: (
        section: string,
        oldKey: string,
        newKey: string,
        value: unknown
    ) => void;
    /** Adds a new field to a general information section */
    addGeneralInfoField: (section: string) => void;
    /** Removes a field from a general information section */
    removeGeneralInfoField: (section: string, key: string) => void;
}

/**
 * Custom hook that creates and manages the state store
 */
export const useADJStore = create<Store>((set, get) => ({
    general_info: {} as GeneralInfo,
    boards: [] as Board[],
    board_list: {} as Record<string, string>,

    /**
     * Assembles the complete ADJ object with current state
     * @returns {ADJ} Complete ADJ object
     */
    assembleADJ: () => {
        return {
            general_info: get().general_info,
            boards: get().boards,
            board_list: get().board_list
        }
    },

    /**
     * Sets the complete store state
     * @param {ADJ} ADJ - Complete ADJ object
     */
    setADJStore: (ADJ: ADJ) => {
        set({
            general_info: ADJ.general_info,
            boards: ADJ.boards,
            board_list: ADJ.board_list,
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ADJ));
    },

    /**
     * Updates a specific field of a board
     * @param {BoardName} boardName - Name of the board
     * @param {keyof Board} field - Field to update
     * @param {string} value - New value
     */
    updateBoard: (boardName: BoardName, field: keyof Board, value: string) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards[boardIndex][boardName] = {
                ...boards[boardIndex][boardName],
                [field]: value,
            };
        }

        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Removes a board
     * @param {BoardName} boardName - Name of the board to remove
     */
    removeBoard: (boardName: BoardName) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards.splice(boardIndex, 1);
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Adds a new board
     * @param {BoardName} boardName - Name of the board
     * @param {BoardInfo} boardInfo - Board information
     */
    addBoard: (boardName: BoardName, boardInfo: BoardInfo) => {
        const boards = get().boards;
        boards.push({ [boardName]: boardInfo });
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Adds a new measurement to a board
     * @param {BoardName} boardName - Name of the board
     * @param {Measurement} measurement - Measurement to add
     */
    addMeasurement: (boardName: BoardName, measurement: Measurement) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards[boardIndex][boardName].measurements.push(measurement);
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Removes a measurement from a board
     * @param {BoardName} boardName - Name of the board
     * @param {string} measurementId - Measurement ID
     */
    removeMeasurement: (boardName: BoardName, measurementId: string) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards[boardIndex][boardName].measurements = boards[boardIndex][boardName].measurements.filter(measurement => measurement.id !== measurementId);
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Updates a specific field of a measurement
     * @param {BoardName} boardName - Name of the board
     * @param {string} measurementId - Measurement ID
     * @param {keyof Measurement} field - Field to update
     * @param {string} value - New value
     */
    updateMeasurement: (
        boardName: BoardName,
        measurementId: string,
        field: keyof Measurement,
        value: unknown,
    ) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            const boardInfo = boards[boardIndex][boardName] as BoardInfo;
            const measurementIndex = boardInfo.measurements.findIndex(
                (measurement) => measurement.id === measurementId,
            );
            if (measurementIndex !== -1) {
                boardInfo.measurements[measurementIndex] = {
                    ...boardInfo.measurements[measurementIndex],
                    [field]: value,
                };
            }
        }

        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /** 
     * Adds a new packet to a board
     * @param {BoardName} boardName - Name of the board
     * @param {Packet} packet - Packet to add
     */
    addPacket: (boardName: BoardName, packet: Packet) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards[boardIndex][boardName].packets.push(packet);
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Removes a packet from a board
     * @param {BoardName} boardName - Name of the board
     * @param {string} packetId - Packet ID
     */
    removePacket: (boardName: BoardName, packetId: string) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            boards[boardIndex][boardName].packets = boards[boardIndex][boardName].packets.filter(packet => packet.id !== packetId);
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Updates a specific field of a packet
     * @param {BoardName} boardName - Name of the board
     * @param {string} packetId - Packet ID
     * @param {keyof Packet} field - Field to update
     * @param {unknown} value - New value
     */
    updatePacketField: (boardName: BoardName, packetId: string, field: keyof Packet, value: unknown) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            (board) => Object.keys(board)[0] === boardName,
        );
        if (boardIndex !== -1) {
            const boardInfo = boards[boardIndex][boardName] as BoardInfo;
            const packetIndex = boardInfo.packets.findIndex(
                (packet) => packet.id === packetId,
            );
            if (packetIndex !== -1) {
                boardInfo.packets[packetIndex] = {
                    ...boardInfo.packets[packetIndex],
                    [field]: value,
                };
            }
        }
        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Updates a specific field of a measurement range
     * @param {BoardName} boardName - Name of the board
     * @param {string} measurementId - Measurement ID
     * @param {'above' | 'below'} range - Range type
     * @param {keyof Range} field - Field to update
     * @param {string} value - New value
     */
    updateRange: (
        boardName: BoardName,
        measurementId: string,
        range: 'above' | 'below',
        field: keyof Range,
        value: string
    ) => {
        const boards = get().boards;
        const boardIndex = boards.findIndex(
            board => Object.keys(board)[0] === boardName
        )
        if (boardIndex !== -1) {
            const boardInfo = boards[boardIndex][boardName] as BoardInfo
            const measurementIndex = boardInfo.measurements.findIndex(
                measurement => measurement.id === measurementId
            )
            if (measurementIndex !== -1) {
                const measurement = boardInfo.measurements[measurementIndex]
                const measurementRange = measurement[range] as Range;
                measurement[range] = {
                    ...measurementRange,
                    [field]: value
                }
            }
        }

        set((state) => {
            const newState = { ...state, boards };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        })
    },

    /**
     * Updates a field in the general information
     * @param {string} section - Section to update
     * @param {string} oldKey - Previous field key
     * @param {string} newKey - New field key
     * @param {unknown} value - New value
     */
    updateGeneralInfoField: (section: string, oldKey: string, newKey: string, value: unknown) => {
        const generalInfo = get().general_info;
        const generalInfoSection = generalInfo[section] as Record<string, unknown>;

        if (oldKey !== newKey) {
            delete generalInfoSection[oldKey];
        }
        generalInfoSection[newKey] = value;
        generalInfo[section] = generalInfoSection;

        set((state) => {
            const newState = { ...state, general_info: generalInfo };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    },

    /**
     * Adds a new field to a general information section
     * @param {string} section - Section to add the field to
     */
    addGeneralInfoField: (section: string) => {
        set((state) => {
            const generalInfo = { ...state.general_info };
            const generalInfoSection = { ...(typeof generalInfo[section] === 'object' && generalInfo[section] !== null ? generalInfo[section] : {}) } as Record<string, unknown>;
    
            let newKey = "new_key";
            let counter = 1;
            while (Object.prototype.hasOwnProperty.call(generalInfoSection, newKey)) {
                newKey = `new_key_${counter++}`;
            }
    
            generalInfoSection[newKey] = "";
    
            return {
                ...state,
                general_info: {
                    ...generalInfo,
                    [section]: generalInfoSection
                }
            };
        });
    },
    
    /**
     * Removes a field from a general information section
     * @param {string} section - Section to remove the field from
     * @param {string} key - Key of the field to remove
     */
    removeGeneralInfoField: (section: string, key: string) => {
        set((state) => {
            const generalInfo = { ...state.general_info };
            const generalInfoSection = { ...(typeof generalInfo[section] === 'object' && generalInfo[section] !== null ? generalInfo[section] : {}) } as Record<string, unknown>;
    
            delete generalInfoSection[key];
    
            return {
                ...state,
                general_info: {
                    ...generalInfo,
                    [section]: generalInfoSection
                }
            };
        });
    },
}));

// Cargar el estado inicial desde localStorage
const storedState = localStorage.getItem(STORAGE_KEY);
if (storedState) {
    useADJStore.setState(JSON.parse(storedState));
}
