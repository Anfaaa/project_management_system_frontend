// CommentsSection.jsx

import React, { useEffect, useState } from 'react';
import { CreateComment, GetComments, EditComment, DeleteComment } from '../../API'; 
import Button from '../../components/button/Button';
import EditCommentIcon from '../../components/EditCommentIcon';
import DeleteCommentIcon from '../../components/DeleteCommentIcon';
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

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await GetComments(task_id);
                setComments(response.data);
                console.log('Получены комментарии к задаче: ', response.data)
            } catch (error) {
                console.error(error.message);
            }
        };
        getComments();

        const interval = setInterval(() => {
            getComments(); // Запрос каждые 3 секунды
        }, 3000);

        return () => clearInterval(interval);
    }, [task_id, refreshTrigger]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!newCommentText.trim()) return;
        try {
            const response = await CreateComment({task_id, text: newCommentText });
            console.log('Комментарий успешно создан:', response.data);
            setNewCommentText('');
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Ошибка при создании комментария:', error.response?.data);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            try {
                const response = await DeleteComment(commentId);
                console.log('Комментарий удален:', response.data);
                setRefreshTrigger(prev => !prev);
            } catch (error) {
                console.error('Ошибка при удалении комментария:', error);
            }
        }
    };

    const handleEditComment = (comment) => {
        setEditedComment(comment);
        setEditedCommentText(comment.text);
    };

    const handleSaveEditedComment = async () => {
        if (!editedCommentText.trim()) return;
        try {
            const response = await EditComment(editedComment.id, {text: editedCommentText});
            console.log('Комментарий успешно изменен:', response.data)
            setEditedComment(null);
            setEditedCommentText('');
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Ошибка при обновлении комментария:', error);
        }
    };

    if (!comments) {
        return <div>Загрузка комментариев...</div>;
    }

    return (
        <div className="comments-section">
            <h3>Комментарии</h3>
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
                            />
                            <div className='button-group'>
                                <Button onClick={handleSaveEditedComment}>Сохранить</Button>
                                <Button onClick={() => setEditedComment(null)}>Отменить</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                {userID === comment.user_id && (
                                    <div className='comment-icon-container'>
                                        <DeleteCommentIcon
                                            onClick={() => handleDeleteComment(comment.id)}
                                        />
                                        <EditCommentIcon
                                            onClick={() => handleEditComment(comment)}
                                        />
                                    </div>
                                )}
                                <strong>{comment.created_by_first_name} {comment.created_by_last_name} ({comment.created_by_username})</strong>: 
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