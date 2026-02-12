export type ChipValue = 10 | 20 | 50;

export type BetType =
    | 'number'
    | 'color'
    | 'parity'
    | 'range'
    | 'dozen'
    | 'column';

export interface Bet {
    id: string;
    type: BetType;
    value: string | number; // e.g. "red", 17, "1st 12"
    amount: number;
}

export const WHEEL_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const RED_NUMBERS = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
];

export const BLACK_NUMBERS = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
];
