import { CellState } from './CellState'

export enum CellType {
    none,
    one,
    two, 
    three, 
    four,
    five,
    six,
    seven,
    eight,
    bomb,
    explosion
}

export type Cell = { value: CellType, state: CellState };

