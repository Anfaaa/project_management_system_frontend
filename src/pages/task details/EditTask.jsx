// EditTask.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PRIORITY_LABELS } from '../../const';
import { getProjectUsersToAssign } from "../../utils/getProjectUsersToAssign.js";
import Button from "../../components/button/Button.jsx";
import '../../styles/creation-form.css';
import { EditTaskInfo, GetTaskDetails } from "../../API/tasksAPI.js";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [taskInfo, setTaskInfo] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        assigned_to: '',
        is_gittable: false,
        git_url: ''
    });
    const projectId = location.state?.projectId;
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
    const user_id = JSON.parse(localStorage.getItem('user_id'));

    useEffect(() => {
        if (users.length > 0) return;

        const GetDetails = async () => {
            try {
                const response = await GetTaskDetails(id);

                console.log('Получены детали задачи:', response.data);
                setTaskInfo(response.data);
            } 
            catch (error) {
                console.error('Ошибка при загрузке деталий задачи:', error);
                alert('Ошибка при загрузке деталей задачи, попробуйте позднее.');
            }
        };

        GetDetails();

        const GetUsers = async () => {
            await getProjectUsersToAssign({
                projectId,
                current_user_group,
                user_id,
                setUsers,
                setAssignedTo: (id) => setTaskInfo(prev => ({ ...prev, assigned_to_id: id }))
            });

            if (!Array.isArray(users)) {
                navigate(location.state?.from || `/tasks/${id}/details`);
            }
        };

        GetUsers();

    }, [id, current_user_group, projectId, users, user_id, navigate, location.state?.from]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setTaskInfo((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');

        try {
            const response = await EditTaskInfo(id, taskInfo);

            console.log('Задача успешно обновлена',  response.data);
            navigate(`/tasks/${id}/details`);
        } 
        catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.no_rights)
                    setErrorMessage(errorData.no_rights);

                else if (errorData.due_date) 
                    setErrorMessage(errorData.due_date);

                else setErrorMessage("Неизвестная ошибка при изменении задачи, \nпопробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return (
        <div className='form-container creation-form'>
            <h2>Редактирование задачи</h2>
            <form className='form' onSubmit={handleSubmit}>
                <div className='form-row'>
                    <label htmlFor='title'>Название:</label>
                    <input 
                        type='text'
                        name="title"
                        id='title'
                        value={taskInfo.title}
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
                        value={taskInfo.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='dueDate'>Дата окончания:</label>
                    <input 
                        type='date'
                        name="due_date"
                        id='dueDate'
                        value={taskInfo.due_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='priority'>Приоритет:</label>
                    <select
                        name="priority"
                        value={taskInfo.priority}
                        onChange={handleInputChange}>
                        {Object.keys(PRIORITY_LABELS).map((key) => (
                            <option key={key} value={key}>{PRIORITY_LABELS[key]}</option>
                        ))}
                    </select>
                </div>
                <div className='form-row'>
                    <label htmlFor='assigned_to'>Назначить:</label>
                    <select 
                        name="assigned_to" 
                        value={taskInfo.assigned_to} 
                        onChange={handleInputChange}
                        disabled={current_user_group.group_name_in_project === 'Исполнитель'} 
                    >
                        <option value="">Выберите исполнителя:</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name} ({user.username})
                            </option>
                        ))}
                    </select>
                </div>
                <div className='form-row'>
                    <label htmlFor='isGittable'>Подключить GitFlic?</label>
                    <input
                        name="is_gittable"
                        type='checkbox'
                        id='isGittable'
                        checked={taskInfo.is_gittable}
                        onChange={(e) => setTaskInfo((prevTask) => ({
                            ...prevTask,
                            is_gittable: !prevTask.is_gittable,
                        }))}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='gitUrl'>Ссылка на файл в репозитории: </label>
                    <input 
                        name="git_url"
                        type='url'
                        id='gitUrl'
                        value={taskInfo.git_url}
                        onChange={handleInputChange}
                        disabled={!taskInfo.is_gittable}
                    />
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <div className="button-group">
                    <Button onClick={() => navigate(location.state?.from || `/tasks/${id}/details`)}>Отмена</Button>
                    <Button type='submit'>Изменить задачу</Button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;