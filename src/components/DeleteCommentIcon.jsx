import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function DeleteCommentIcon({onClick}) {
    const { theme } = useTheme();
    const deleteCommentIconImg = theme ? require('../icons/delete_comment_icon2.png') : require('../icons/delete_comment_icon.png');
    return (
        <img
            src={deleteCommentIconImg}
            alt='Удалить комментарий'
            className='icon'
            onClick={onClick}
        />
    )
}