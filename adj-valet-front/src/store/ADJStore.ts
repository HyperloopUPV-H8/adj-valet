/**
 * @fileoverview Central state store for the ADJ-Valet application using Zustand
 */

import { create } from 'zustand';
import { ADJ } from '../types/ADJ';
import { Board, BoardInfo, BoardName } from '../types/Board';
import { Measurement, Range } from '../types/Measurement';
import { GeneralInfo } from '../types/GeneralInfo';

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
    /** Updates a specific field of a measurement */
    updateMeasurement: (
        boardName: BoardName,
        measurementId: string,
        field: keyof Measurement,
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
    setADJStore: (ADJ: ADJ) =>
        set({
            general_info: ADJ.general_info,
            boards: ADJ.boards,
            board_list: ADJ.board_list,
        }),

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

        set((state) => ({
            ...state,
            boards,
        }));
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

        set((state) => ({
            ...state,
            boards,
        }));
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

        set((state) => ({
            ...state,
            boards
        }))
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

        set((state) => ({
            ...state,
            general_info: generalInfo,
        }));
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
