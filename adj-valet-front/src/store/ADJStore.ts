import { create } from 'zustand';
import { ADJ } from '../types/ADJ';
import { Board, BoardInfo, BoardName } from '../types/Board';
import { Measurement, Range } from '../types/Measurement';

interface Store {
    general_info: object;
    boards: Board[];
    board_list: object;

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
}

export const useADJStore = create<Store>((set, get) => ({
    general_info: {},
    boards: [] as Board[],
    board_list: {},

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
    }
}));
