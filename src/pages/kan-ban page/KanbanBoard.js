// KanbanBoard.js

import { Draggable, Droppable } from 'react-drag-and-drop';
import ProjectSideBar from "../../components/side bars/ProjectSideBar.jsx";
import { useState, useEffect } from 'react';
import { ChangeTaskStatus, GetMyTasks } from '../../API';
import { Link } from 'react-router-dom';
import './kanban-board.css';
import { TASK_STATUS_LABELS } from '../../const';

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
    const project_id = current_user_group.project_id;

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await GetMyTasks(project_id);
                setTasks(response.data);
                console.log("Полученные задачи:", response.data)
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        };
        getTasks();
    }, [project_id]);

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const handleDrop = async (taskId, newStatus) => {
        try {
            await ChangeTaskStatus(taskId, newStatus);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id.toString() === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении статуса задачи:', error);
            alert('Не удалось обновить статус задачи');
        }
    };

    return (
        <div className="page-container-for-sidebar">
            <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={project_id}/>
            <div className="page-content">
                <h1 className='headLabel'>Кан-бан для работы с задачами</h1>
                <div className="kanban-board">
                    {Object.entries(TASK_STATUS_LABELS).map(([status, label]) => (
                        <Droppable
                            key={status}
                            types={['task']}
                            onDrop={(data) => handleDrop(data.task, status)}
                            className="kanban-column"
                        >
                            <div className="boarder">{label}</div>
                            <div className="kanban-tasks">
                                {getTasksByStatus(status).map((task) => (
                                    <Draggable
                                        key={task.id}
                                        type="task"
                                        data={task.id.toString()}
                                        className="kanban-task"
                                    >
                                        <Link to={`/tasks/${task.id}/details`} state={{ from: window.location.pathname }}>
                                            {task.title}
                                        </Link>
                                        <br />
                                        Дата сдачи: {new Date(task.due_date).toLocaleDateString()}
                                    </Draggable>
                                ))}
                            </div>
                        </Droppable>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
