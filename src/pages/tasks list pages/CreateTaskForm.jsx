// CreateTaskForm.jsx

import { useState, useEffect } from "react";
import { PRIORITY_LABELS } from '../../const.js';
import Button from "../../components/button/Button.jsx";
import { getProjectUsersToAssign } from "../../utils/getProjectUsersToAssign.js";
import '../../styles/creation-form.css';
import { CreateTask } from "../../API/tasksAPI.js";

const CreateTaskForm = ( {createFormHidden, projectId} ) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Низкий');
    const [assignedTo, setAssignedTo] = useState('');
    const [isGittable, setIsGittable] = useState(false);
    const [gitUrl, setGitUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState([]);
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
    const user_id = JSON.parse(localStorage.getItem('user_id'));

    useEffect(() => {
        if (users.length > 0) return;

        const GetUsers = async () => {
            await getProjectUsersToAssign({
                projectId,
                current_user_group,
                user_id,
                setUsers,
                setAssignedTo
            });

            if (!Array.isArray(users)) {
                createFormHidden();
            }
        }

        GetUsers();

    }, [current_user_group, projectId, users, user_id, createFormHidden]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        setErrorMessage('');

        try {
            const response = await CreateTask({
                title,
                description,
                due_date: dueDate,
                status: "Не начато",
                priority,
                is_gittable: isGittable,
                git_url: gitUrl,
                created_by_id: user_id,
                assigned_to_id: assignedTo,
                project_id: projectId,
            });

            console.log('Задача успешно создана', response.data);
            createFormHidden();
        }
        catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.created_by_id) 
                    setErrorMessage(errorData.created_by_id);

                else if (errorData.assigned_to_id)
                    setErrorMessage(errorData.assigned_to_id);

                else if (errorData.no_membership)
                    setErrorMessage(errorData.no_membership);

                else if (errorData.no_assign_rights)
                    setErrorMessage(errorData.no_assign_rights);

                else if (errorData.no_rights)
                    setErrorMessage(errorData.no_rights);

                else if (errorData.due_date) 
                    setErrorMessage(errorData.due_date);

                else setErrorMessage("Неизвестная ошибка при создании проекта, \nпопробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return (
        <div className='form-container creation-form'>
            <h2>Создание задачи</h2>
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
                    <label htmlFor='dueDate'>Дата сдачи:</label>
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
                    <label htmlFor='assigned_to'>Назначить:</label>
                    <select 
                        name="assigned_to" 
                        value={assignedTo} 
                        onChange={(e) => setAssignedTo(e.target.value)}
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
                        type='checkbox'
                        id='isGittable'
                        checked={isGittable}
                        onChange={(e) => setIsGittable(e.target.checked)}
                    />
                </div>
                <div className='form-row'>
                    <label htmlFor='gitUrl'>Ссылка на файл в репозитории:</label>
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
                    <Button type='submit'>Создать задачу</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTaskForm;