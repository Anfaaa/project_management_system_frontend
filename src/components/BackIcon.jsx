// BackIcon.jsx

import "../styles/icon.css"
import backIconImg from '../icons/back_icon.png'

export default function BackIcon({onClick}) {
    return (
        <img
            src={backIconImg}
            alt='Назад'
            className='icon icon-back'
            onClick={onClick}
        />
    )
}