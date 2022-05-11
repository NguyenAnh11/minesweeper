import { CellType, Cell } from './CellType'
import { CellState } from './CellState'
import { ROWS, COLS, BOOMS } from './Constant'


export const generateCells = () => {
    //generate board
    let cells: Cell[][] = [];
    for(let row = 0; row < ROWS; row++ ){
        cells.push([]);
        for(let col = 0; col < COLS; col++ ){ 
            cells[row].push({
                value: CellType.none,
                state: CellState.close
            })
        }
    }
    //pubt bomb to board
    for(let boom = 0; boom < BOOMS; boom++ ) {
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);

        const currentCell = cells[r][c].value;

        if(currentCell === CellType.bomb) continue;

        cells[r][c] = { ...cells[r][c], value: CellType.bomb };
    }
    //count adjcent bomb 
    for(let row = 0; row < ROWS; row++) {
        for(let col = 0; col < COLS; col++) {
            let currentValue = cells[row][col].value;
            if(currentValue === CellType.bomb) continue;
            
            let totalBombs = 0;

            let dr = [-1, 0, 1], dc = [-1, 0, 1];
            for(let r = 0; r < dr.length; r++) {
                let nextR = row + dr[r];
                if(nextR < 0 || nextR >= ROWS) continue;

                for(let c = 0; c < dc.length; c++) {
                    let nextC = dc[c] + col;
                    if(nextC < 0 || nextC >= COLS) continue;

                    if(cells[nextR][nextC].value === CellType.bomb) 
                        totalBombs++;
                }
            }
            
            if(totalBombs === 0) continue;

            cells[row][col] = { ...cells[row][col], value: totalBombs };
        }
    }
    return cells;
}

const grabAllAdjacentCells = (
    cells: Cell[][], 
    row: number, 
    col: number): {
        topLeftCell: Cell | null,
        topCell: Cell | null,
        topRightCell: Cell | null,
        leftCell: Cell | null,
        rightCell: Cell | null,
        bottomLeftCell: Cell | null,
        bottomCell: Cell | null,
        bottomRightCell: Cell | null
    } => {
        const topLeftCell = (row > 0 && col > 0) ? cells[row - 1][col - 1] : null;
        const topCell = (row > 0) ? cells[row - 1][col] : null;
        const topRightCell = (row > 0 && col < COLS - 1) ? cells[row - 1][col + 1] : null;
        const leftCell = (col > 0) ? cells[row][col - 1] : null;
        const rightCell = (col < COLS - 1) ? cells[row][col + 1] : null;    
        const bottomLeftCell = (row < ROWS - 1 && col > 0) ? cells[row + 1][col - 1] : null;
        const bottomCell = (row < ROWS - 1) ? cells[row + 1][col] : null;
        const bottomRightCell = (row < ROWS - 1 && col < COLS - 1) ? cells[row + 1][col + 1] : null;

        return {
            topLeftCell,
            topCell,
            topRightCell,
            leftCell,
            rightCell,
            bottomLeftCell,
            bottomCell,
            bottomRightCell
        }
}

export const openMultipleCells = (cells: Cell[][], row: number, col: number): Cell[][] => {
    let currentCell = cells[row][col];
    if(
        currentCell.state === CellState.open ||
        currentCell.state === CellState.flagged ||
        currentCell.value === CellType.bomb
    ) {
        return cells;
    }
    let nextCells = cells.slice();
    nextCells[row][col].state = CellState.open;
    const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
    } = grabAllAdjacentCells(cells, row, col);

    if(topLeftCell) {
        if(topLeftCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row - 1, col - 1);
        } else {
            nextCells[row - 1][col - 1].state = CellState.open;
        }
    }

    if(topCell) {
        if(topCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row - 1, col);
        } else {
            nextCells[row - 1][col].state = CellState.open;
        }
    }

    if(topRightCell) {
        if(topRightCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row - 1, col + 1);
        } else {
            nextCells[row - 1][col + 1].state = CellState.open;
        }
    }

    if(leftCell) {
        if(leftCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row,  col - 1);
        } else {
            nextCells[row][col - 1].state = CellState.open;
        }
    }

    if(rightCell) {
        if(rightCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row, col + 1);
        } else {
            nextCells[row][col + 1].state = CellState.open;
        }
    }

    if(bottomLeftCell) {
        if(bottomLeftCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row + 1, col - 1);
        } else {
            nextCells[row + 1][col - 1].state = CellState.open;
        }
    }

    if(bottomCell) {
        if(bottomCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row + 1, col);
        } else {
            nextCells[row + 1][col].state = CellState.open;
        }
    }

    if(bottomRightCell) {
        if(bottomRightCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row + 1, col + 1);
        } else {
            nextCells[row + 1][col + 1].state = CellState.open;
        }
    }

    return nextCells;
}