// EditProject.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PRIORITY_LABELS } from '../../const';
import Button from "../../components/button/Button.jsx";
import '../../styles/creation-form.css'
import { EditProjectInfo, GetProjectDetails } from "../../API.js";

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [projectInfo, setProjectInfo] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'Низкий',
        is_gittable: false,
        git_url: ''
     });

    useEffect(() => {
        const GetDetails = async () => {
            try {
                const response = await GetProjectDetails(id);
                console.log('Получены детали проекта:', response.data);
                setProjectInfo(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке деталий проекта:', error);
            }
        };
        GetDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectInfo((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await EditProjectInfo(id, projectInfo);
            console.log('Задача успешно обновлена',  response.data);
            navigate(`/projects/${id}/details`);
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.no_rights)
                    setErrorMessage(errorData.no_rights);
                else if (errorData.due_date) 
                    setErrorMessage(errorData.due_date);
                else setErrorMessage("Неизвестная ошибка при изменении проекта, \nпопробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return(
        <div className='form-container creation-form'>
            <h2>Редактирование проекта</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-row'>
                    <label htmlFor='title'>Название:</label>
                    <input 
                        type='text'
                        name="title"
                        id='title'
                        value={projectInfo.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='description'>Описание:</label>
                    <textarea 
                        type='text'
                        name="description"
                        id='description'
                        value={projectInfo.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='dueDate'>Дата окончания:</label>
                    <input 
                        type='date'
                        name="due_date"
                        id='dueDate'
                        value={projectInfo.due_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='priority'>Приоритет:</label>
                    <select
                        name="priority"
                        value={projectInfo.priority}
                        onChange={handleInputChange}>
                        {Object.keys(PRIORITY_LABELS).map((key) => (
                            <option key={key} value={key}>{PRIORITY_LABELS[key]}</option>
                        ))}
                    </select>
                </div>
                <div className='form-row'>
                    <label htmlFor='isGittable'>Подключить GitFlic?</label>
                    <input
                        name="is_gittable"
                        type='checkbox'
                        id='isGittable'
                        checked={projectInfo.is_gittable}
                        onChange={(e) => setProjectInfo((prevProject) => ({
                            ...prevProject,
                            is_gittable: !prevProject.is_gittable,  // Переключаем состояние флажка
                        }))}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='gitUrl'>Ссылка на репозиторий:</label>
                    <input 
                        name="git_url"
                        type='url'
                        id='gitUrl'
                        value={projectInfo.git_url}
                        onChange={handleInputChange}
                        disabled={!projectInfo.is_gittable}
                    />
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                {successMessage && <p className='success-message'>{successMessage}</p>}
                <div className="button-group">
                    <Button onClick={() => navigate(location.state?.from || '/projects-list')}>
                            Отмена
                    </Button>
                    <Button type='submit'>Изменить проект</Button>
                </div>
            </form>
        </div>
    );
};
export default EditProject;