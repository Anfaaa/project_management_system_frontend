// ExitIcon.jsx

import "../styles/icon.css"
import exitIconImg from '../icons/exit_icon.png';
import { useNavigate } from "react-router-dom";

export default function ExitIcon() {
    const navigate = useNavigate()

    const exit = () => {
        localStorage.clear();
        navigate('/login')
    }

    return (
        <img
            src={exitIconImg}
            alt='Выйти'
            className='icon'
            onClick={exit}
        />
    )
}