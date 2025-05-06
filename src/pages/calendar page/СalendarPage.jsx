// calendarPage.js
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import ProjectSideBar from "../../components/side bars/ProjectSideBar.jsx";
import { Link } from 'react-router-dom';
import { GetMyTasksToOthers, GetMyTasks } from '../../API';
import moment from 'moment';
import 'moment/locale/ru';
import './calendar.css';
import "../../styles/page-style-for-sidebar.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ru');
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [myTasksToOthers, setMyTasksToOthers] = useState([]);
  const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
  const can_assign_tasks = (current_user_group.group_name_in_project === 'Менеджер') || (current_user_group.group_name_in_project === 'Руководитель проекта');
  const current_user_id = Number(localStorage.getItem('user_id'));
  const project_id = current_user_group.project_id;
  const [currentDate, setCurrentDate] = useState(new Date()); // Состояние для текущей даты

  useEffect(() => {
    const GetTasks = async () => {
      try {
        const response = await GetMyTasks(project_id);
        setMyTasks(response.data);

        if (can_assign_tasks) {
          const response = await GetMyTasksToOthers(project_id);
          setMyTasksToOthers(response.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке задач", error);
      }
    };
    GetTasks();
  }, [can_assign_tasks, project_id]);

  const allTasks = [...myTasks, ...myTasksToOthers];

  const events = allTasks.map(task => {
    const isAssignedToCurrentUser = task.assigned_to_id === current_user_id;
  
    return {
      title: (
        <div>
          <Link to={`/tasks/${task.id}/details`} state={{ from: window.location.pathname }}>
            {task.title}
          </Link>
          {!isAssignedToCurrentUser && (
            <div>Исполнитель: {task.assigned_to_username}</div>
          )}
        </div>
      ),
      assigned_to_id: task.assigned_to_id,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
    };
  });

  const handleNavigate = (date) => {
    console.log('Navigated to:', date);
    setCurrentDate(date);
  };

  return(
    <div className="page-container-for-sidebar">
        <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={project_id}/>
        <div className="page-content">
          <h1 className='headLabel'>Календарь с датами сдачи заданий</h1>
          <div className="task-calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month']}
              messages={{
                today: 'Сегодня',
                previous: 'Назад',
                next: 'Вперед',
              }}
              onNavigate={handleNavigate}
              date={currentDate}
              eventPropGetter={(event) => {
                const isAssignedToCurrentUser = event.assigned_to_id === current_user_id;
                console.log("event.assigned_to_id:", event.assigned_to_id);
                console.log("current_user_id:", current_user_id);
                
                return {
                  className: isAssignedToCurrentUser ? 'my-task' : 'other-user-task',
                };
              }}
            />
          </div>
        </div>
      </div>
  );
};

export default CalendarPage;
