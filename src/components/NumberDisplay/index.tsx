import React, { FC } from 'react';
import './numberdisplay.scss';

interface NumberDisplayProps{
    value: number;
}

const NumberDisplay:FC<NumberDisplayProps> = ({ value }) => {

    return (
        <div className="NumberDisplay">
            { value.toString().padStart(3, '0') }
        </div>
    )
}   

export default NumberDisplay;