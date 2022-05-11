import React from 'react';
import './cell.scss';
import { Cell, CellType } from '../../utils/CellType';
import { CellState } from '../../utils/CellState';

interface ButtonProps {
    row: number;
    col: number;
    cell: Cell;
    onClick(row: number, col: number): ( ...args: any[]) => void;
    onContext(row: number, col: number): ( ...args: any[]) => void;
}

const COLOR = ['#3462f7', '#11d445', '#e32f0b', '#190575', '#750505', '#059c8c', '#414242', '#8b8c8c'];

const Button: React.FC<ButtonProps> = ({ row, col, cell: { value, state }, onClick, onContext }) => {
    const renderContent = (): React.ReactNode => {
        if(state === CellState.flagged) {

            return (
                <span role="img" aria-label="flag">🚩</span>
            )
        } else if(state === CellState.open) {

            if(value === CellType.bomb) {
                return (
                    <span role="img" aria-label="bomb">💣</span> 
                )
            } else if(value === CellType.explosion) {
                return (
                    <span role="img" aria-label="explosion">💥</span>
                )
            } else if(value !== CellType.none) {
                let color = COLOR[value - 1];
                return (
                    <span style={{color}}>{value}</span>
                )
            } 
        }
        
        return null;
    }

    const handleStyle = () : string => {
        if(value === CellType.none && state === CellState.open) {
            return '#dbd9d9';
        }
        return '';
    }

    return (
        <div 
            className={`Button ${state === CellState.open} ? "open" : ""`}
            style={{background: handleStyle()}}
            onClick={onClick(row, col)} 
            onContextMenu={onContext(row, col)}
        >
            { renderContent() }
        </div>
    )
}

export default Button;