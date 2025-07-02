// CreateProjectForm.jsx

import { useState } from "react";
import { PRIORITY_LABELS } from '../../const.js';
import Button from "../../components/button/Button.jsx";
import '../../styles/creation-form.css';
import { CreateProject } from "../../API/projectsAPI.js";

const CreateProjectForm = ( {createFormHidden} ) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Низкий');
    const [isGittable, setIsGittable] = useState(false);
    const [gitUrl, setGitUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const user_id = localStorage.getItem('user_id');
        setErrorMessage('');

        try {
            const response = await CreateProject({
                title,
                description,
                due_date: dueDate,
                status: "Запланирован",
                priority,
                is_gittable: isGittable,
                git_url: gitUrl,
                created_by_id: user_id,
            });
            console.log('Проект успешно создан', response.data);

            createFormHidden();
        }
        catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.created_by_id) 
                    setErrorMessage(errorData.created_by_id);

                else if (errorData.no_rights)
                    setErrorMessage(errorData.no_rights);

                else if (errorData.due_date) 
                    setErrorMessage(errorData.due_date);

                else setErrorMessage("Неизвестная ошибка при создании проекта, \nпопробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return(
        <div className='form-container creation-form'>
            <h2>Создание проекта</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-row'>
                    <label htmlFor='title'>Название:</label>
                    <input 
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='description'>Описание:</label>
                    <textarea 
                        type='text'
                        id='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='dueDate'>Дата окончания:</label>
                    <input 
                        type='date'
                        id='dueDate'
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='priority'>Приоритет:</label>
                    <select
                        name="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}>
                        {Object.keys(PRIORITY_LABELS).map((key) => (
                            <option key={key} value={key}>{PRIORITY_LABELS[key]}</option>
                        ))}
                    </select>
                </div>
                <div className='form-row'>
                    <label htmlFor='isGittable'>Подключить GitFlic?</label>
                    <input
                        type='checkbox'
                        id='isGittable'
                        checked={isGittable}
                        onChange={(e) => setIsGittable(e.target.checked)}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='gitUrl'>Ссылка на репозиторий:</label>
                    <input 
                        type='url'
                        id='gitUrl'
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        disabled={!isGittable}
                    />
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <div className="button-group">
                    <Button onClick={createFormHidden}>Отмена</Button>
                    <Button type='submit'>Создать проект</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProjectForm;