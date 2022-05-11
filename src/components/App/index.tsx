import React, { useState, useEffect, MouseEvent } from 'react';
import './app.scss';
import NumberDisplay from '../NumberDisplay/index';
import Face from '../Face/index';
import Button from '../Button/index';
import { FLAGS, ROWS, COLS, BOOMS } from '../../utils/Constant';
import { CellState } from '../../utils/CellState'
import { FaceType } from '../../utils/FaceType';
import { generateCells, openMultipleCells } from '../../utils/index';
import { Cell, CellType } from '../../utils/CellType';

const App: React.FC = () => {
    const [cells, setCells] = useState(() => generateCells());
    const [face, setFace] = useState(FaceType.smile);
    const [flag, setFlag] = useState(FLAGS);
    const [time, setTime] = useState(0);
    const [live, setLive] = useState(false);
    const [lost, setLost] = useState(false);
    const [won, setWon] = useState(false);

    useEffect(() => {
        const handleMouseDown = (): void => {
            if(lost || won) return;
            setFace(FaceType.oh);
        }
        const handleMouseUp = (): void => {
            if(lost || won) return;
            setFace(FaceType.smile);
        }

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [lost, won]);

    useEffect(() => {
        if(live && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [live, time])

    useEffect(() => {
        if(lost) {
            setLive(false);
            setFace(FaceType.lost);
        }
    }, [lost]);

    useEffect(() => {
        if(won) {
            setLive(false);
            setFace(FaceType.win);
        }
    }, [won]);

    const handleCellContext= (row: number, col: number) => 
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();

        if(lost || won) return;

        if(!live) {
            setLive(true);
        }

        let currentCells = cells.slice();
        let currentState = cells[row][col].state;

        if(currentState === CellState.open) {

            return;
        } else if(currentState === CellState.flagged) {
            
            currentCells[row][col].state = CellState.close;
            setFlag(flag + 1);
            setCells(currentCells);
        } else if(currentState === CellState.close){
            
            if(flag > 0) {
                currentCells[row][col].state = CellState.flagged;
                setFlag(flag - 1);
                setCells(currentCells);
            } else {
                alert(`You have already used ${FLAGS} flags`);
                return;
            }
        }
    } 

    const showAllBooms = (r: number, c: number): Cell[][] => {
        let currentCells = cells.slice();
        return currentCells.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
                if(rowIndex === r && colIndex === c) {
                    return {
                        ...cell,
                        value: CellType.explosion,
                        state: CellState.open
                    }
                } else if(cell.value === CellType.bomb) {
                    if(cell.state === CellState.flagged) {
                        return cell;
                    } else {
                        return {
                            ...cell,
                            state: CellState.open
                        }
                    }
                } 
                return cell;
            })
        )
    }

    const handleFaceClick = (): void => {
        setLive(false);
        setFace(FaceType.smile);
        setFlag(FLAGS);
        setTime(0);
        setCells(generateCells());
        setLost(false);
        setWon(false);
    }

    const handleCellClick = (row: number, col: number) => () :void => {
        if(lost || won) return;

        if(!live) {
            setLive(true);
        }

        let nextCells = cells.slice();
        let currentCell = cells[row][col];

        if([CellState.flagged, CellState.open].includes(currentCell.state)) return;

        else if(currentCell.value === CellType.bomb) {
            setLost(true);
            nextCells = showAllBooms(row, col);
            setCells(nextCells);
            return;
        } else if(currentCell.value !== CellType.none) {
            nextCells[row][col].state = CellState.open;
        } else if(currentCell.value === CellType.none) {
            nextCells = openMultipleCells(nextCells, row, col);
        }

        //detect win
        let number = 0;
        for(let r = 0; r < ROWS; r++) {
            for(let c = 0; c < COLS; c++) {
                let cell = nextCells[r][c];
                if(cell.state === CellState.open) {
                    number += 1;
                }
            }
        }

        if(number === ROWS * COLS - BOOMS) {
            setWon(true);

            nextCells = nextCells.map((rows, r) => 
                rows.map((cell, c) => {
                    if(cell.state === CellState.flagged) {
                        return cell;
                    }
                    else if(cell.value === CellType.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged
                        };
                    } else {
                        return cell;
                    }
                })
            );
        } 
        setCells(nextCells);
    }   

    const renderCells = (): React.ReactNode => {
        return cells.map((rows, rowIndex) => 
            rows.map((val, colIndex) => 
                <Button 
                    key={rowIndex + "_" + colIndex}
                    row={rowIndex}
                    col={colIndex}
                    cell={val}
                    onClick={handleCellClick}
                    onContext={handleCellContext}
                />
            )
        )
    }

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={flag}/>
                <Face face={face} onFaceClick={handleFaceClick}/>
                <NumberDisplay value={time}/>
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
}

export default App;