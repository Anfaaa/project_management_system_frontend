// CommentsSection.jsx

import React, { useEffect, useState } from 'react';
import { CreateComment, GetComments, EditComment, DeleteComment } from '../../API/commentsAPI.js'; 
import Button from '../../components/button/Button';
import EditCommentIcon from '../../components/icons/EditCommentIcon';
import DeleteCommentIcon from '../../components/icons/DeleteCommentIcon';
import '../../styles/details-page.css';
import '../../styles/form.css';
import './comment-section.css';

const CommentsSection = ( {task_id, can_add_comments} ) => {
    const userID = JSON.parse(localStorage.getItem('user_id'));
    const [comments, setComments] = useState([]); 
    const [newCommentText, setNewCommentText] = useState('');
    const [editedComment, setEditedComment] = useState(null); 
    const [editedCommentText, setEditedCommentText] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Похоже, комментариев пока нет.');

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await GetComments(task_id);

                setComments(response.data);
                console.log('Получены комментарии к задаче: ', response.data);
            } 
            catch (error) {
                console.error(error.message);
                setErrorMessage('Ошибка при получении комментариев к задаче.');
            }
        };

        getComments();

        const interval = setInterval(() => {
            getComments(); // Запрос каждые 3 секунды
        }, 3000);

        return () => clearInterval(interval);

    }, [task_id, refreshTrigger]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newCommentText.trim()) {
            alert("Текст комментария обязателен.");
            return;
        }

        try {
            const response = await CreateComment(task_id, {task_id, text: newCommentText });

            console.log('Комментарий успешно создан:', response.data);

            setNewCommentText('');
            setRefreshTrigger(prev => !prev);
        } 
        catch (error) {
            console.error('Ошибка при создании комментария:', error.response?.data);
            alert('Ошибка при создании комментария');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            try {
                const response = await DeleteComment(commentId);

                console.log('Комментарий удален:', response.data);
                setRefreshTrigger(prev => !prev);
            } 
            catch (error) {
                console.error('Ошибка при удалении комментария:', error);
                alert('Ошибка при удалении комментария');
            }
        }
    };

    const handleEditComment = (comment) => {
        setEditedComment(comment);
        setEditedCommentText(comment.text);
    };

    const handleSaveEditedComment = async () => {
        if (!editedCommentText.trim()){
            alert("Текст комментария обязателен.");
            return;
        }

        try {
            const response = await EditComment(editedComment.id, {text: editedCommentText});

            console.log('Комментарий успешно изменен:', response.data);

            setEditedComment(null);
            setEditedCommentText('');
            setRefreshTrigger(prev => !prev);
        } 
        catch (error) {
            console.error('Ошибка при обновлении комментария:', error);
            alert('Ошибка при обновлении комментария');
        }
    };

    var commentsExistence = comments.length !== 0;

    return (
        <div className="comments-section">
            <h3>Комментарии</h3>
            { commentsExistence ? (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            {editedComment && editedComment.id === comment.id ? (
                                <div>
                                    <textarea
                                        value={editedCommentText}
                                        onChange={(e) => setEditedCommentText(e.target.value)}
                                        rows="4"
                                        className="comment-input"
                                        required
                                    />
                                    <div className='button-group'>
                                        <Button onClick={handleSaveEditedComment}>Сохранить</Button>
                                        <Button onClick={() => setEditedComment(null)}>Отменить</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        {userID === comment.created_by && (
                                            <div className='comment-icon-container'>
                                                <DeleteCommentIcon onClick={() => handleDeleteComment(comment.id)}/>
                                                <EditCommentIcon onClick={() => handleEditComment(comment)}/>
                                            </div>
                                        )}
                                        <strong>
                                            {comment.created_by_first_name} {comment.created_by_last_name} ({comment.created_by_username})
                                        </strong>: 
                                        <p dangerouslySetInnerHTML={{ __html: comment.text.replace(/\n/g, '<br />') }} />
                                    </div>
                                    <p className="comment-date">
                                        {new Date(comment.created_at).toLocaleString()}
                                        {comment.is_edited && <span className="edited-label"> (Изменено)</span>}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="comments-list">{errorMessage}</div>
            )}
            {can_add_comments && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Добавить комментарий..."
                        className='comment-input'
                        rows="4"
                        required
                    />
                    <Button type="submit">Добавить</Button>
                </form>
            )}
        </div>
    );
};

export default CommentsSection;