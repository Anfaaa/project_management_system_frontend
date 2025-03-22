// CreateProjectForm.jsx

import { useState } from "react";
import Button from "../../components/button/Button.jsx";
import "./create-project-form.css"


const CreateProjectForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [isGittable, setIsGittable] = useState(false);
    const [gitUrl, setGitUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    return(
            <div className='form-container create-project-form'>
                <h2>Создание проекта</h2>
                <form className='form'>
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
                        <input 
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
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value='low'>Низкий</option>
                            <option value='medium'>Средний</option>
                            <option value='high'>Высокий</option>
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
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    <div className="button-group">
                        <Button type='exit' >Отмена</Button>
                        <Button type='submit'>Создать проект</Button>
                    </div>
                </form>
            </div>
        );
}
export default CreateProjectForm;