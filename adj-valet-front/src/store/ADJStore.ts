import { create } from 'zustand';
import { ADJ } from '../types/ADJ';
import { Board, BoardInfo, BoardName } from '../types/Board';
import { Measurement, Range } from '../types/Measurement';
import { GeneralInfo } from '../types/GeneralInfo';

interface Store {
    general_info: GeneralInfo;
    boards: Board[];
    board_list: Record<string, string>;

    assembleADJ: () => ADJ;
    setADJStore: (ADJ: ADJ) => void;
    updateBoard: (
        boardName: BoardName,
        field: keyof Board,
        value: string,
    ) => void;
    updateMeasurement: (
        boardName: BoardName,
        measurementId: string,
        field: keyof Measurement,
        value: string,
    ) => void;
    updateRange: (
        boardName: BoardName,
        measurementId: string,
        range: 'above' | 'below',
        field: keyof Range,
        value: string
    ) => void;
    updateGeneralInfoField: (
        section: string,
        oldKey: string,
        newKey: string,
        value: unknown
    ) => void;
    addGeneralInfoField: (section: string) => void;
    removeGeneralInfoField: (section: string, key: string) => void;
}

export const useADJStore = create<Store>((set, get) => ({
    general_info: {} as GeneralInfo,
    boards: [] as Board[],
    board_list: {} as Record<string, string>,

    assembleADJ: () => {
        return {
            general_info: get().general_info,
            boards: get().boards,
            board_list: get().board_list
        }
    },

    setADJStore: (ADJ: ADJ) =>
        set({
            general_info: ADJ.general_info,
            boards: ADJ.boards,
            board_list: ADJ.board_list,
        }),

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

    updateMeasurement: (
        boardName: BoardName,
        measurementId: string,
        field: keyof Measurement,
        value: string,
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
