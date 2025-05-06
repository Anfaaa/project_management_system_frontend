import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function EditCommentIcon({onClick}) {
    const { theme } = useTheme();
    const editCommentIconImg = theme ? require('../icons/edit_comment_icon2.png') : require('../icons/edit_comment_icon.png');
    return (
        <img
            src={editCommentIconImg}
            alt='Редактировать комментарий'
            className='icon'
            onClick={onClick}
        />
    )
}