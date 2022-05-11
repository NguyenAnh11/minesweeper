import React, { MouseEventHandler } from 'react'
import './face.scss'
import { FaceType } from '../../utils/FaceType'

interface FaceProps {
    face: FaceType;
    onFaceClick: MouseEventHandler<HTMLDivElement>;
}

const Face: React.FC<FaceProps> = ({ face, onFaceClick }) => {
    return (
        <div 
            className="Face"
            onClick={onFaceClick}
        >
            <span aria-label="face" role="img">{face}</span>
        </div>
    )
}
export default Face