// StatisticsPage.jsx

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';
import ProjectSideBar from "../components/side bars/ProjectSideBar.jsx";
import Button from '../components/button/Button.jsx';
import { GetStatusDistribution, GetPriorityDistribution, GetUserTaskDistribution, 
  GetUnderloadedUsers, GetOverloadedUsers, GetUsersInProject } from '../API.js';
import '../styles/details-page.css';

const StatisticsPage = () => {
  const { id } = useParams();
  const [chartType, setChartType] = useState('');
  const [chartDetail, setChartDetail] = useState('');
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const user_id = JSON.parse(localStorage.getItem('user_id'));
  const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
  const [selectedUser, setSelectedUser] = useState('');
  const [chartVisible, setChartVisible] = useState(false)
  const is_admin = JSON.parse(localStorage.getItem('is_admin'));

  useEffect(() => {
    const GetUsers = async () => {
      if (users.length > 0) return;
      try {
        const response = await GetUsersInProject(id); 
        console.log('Полученные пользователи:', response.data);
        const users_list = response.data.filter(user => user.group_in_project !== 'Руководитель проекта')
        if (is_admin) {
          setUsers(users_list);
        }
        else if (current_user_group?.group_name_in_project !== 'Руководитель проекта') {
            const manager_users_list = response.data.filter(user =>
                (user.group_in_project !== 'Менеджер' || user.id === user_id)
            );
            setUsers(manager_users_list);
        } else {
            setUsers(users_list);
        }
      }
      catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      }
    }
    GetUsers();
  }, [current_user_group?.group_name_in_project, id, user_id, users.length, is_admin]);

  const handleShowChart = async () => {
    setChartVisible(true);
    try {
      var response = '';
      switch (chartDetail) {
        case 'get_status':
          response = await GetStatusDistribution(id);
          console.log('Получены данные:', response.data);
          setChartData(response.data.map(item => ({
            name: item.status,
            value: item.count
          })));
        break;
        case 'get_priority':
          response = await GetPriorityDistribution(id);
          console.log('Получены данные:', response.data);
          setChartData(response.data.map(item => ({
            name: item.priority,
            value: item.count
          })));
        break;
        case 'get_underload':
          response = await GetUnderloadedUsers(id);
          console.log('Получены данные:', response.data);
          setChartData(response.data.map(item => ({
            name: item.username,
            value: item.task_count
          })));
        break;
        case 'get_overload':
          response = await GetOverloadedUsers(id);
          console.log('Получены данные:', response.data);
          setChartData(response.data.map(item => ({
            name: item.username,
            value: item.task_count
          })));
        break;
        case 'get_user_tasks':
          if (selectedUser !== '') {
            response = await GetUserTaskDistribution(id, selectedUser);
            console.log('Получены данные:', response.data);
            setChartData(response.data.map(item => ({
              name: item.status,
              value: item.count
            })));
          } else {
            alert('Не выбран пользователь для анализа задач!');
            return;
          }
          break;
        default: alert("Выберите детали диаграммы!")
        return;
      }
    }
    catch (error) {
        console.error('Ошибка при загрузке статистики', error);
        alert('Ошибка при загрузке статистики. Повторите попытку позже.')
    }
  };

  return (
    <div className="page-container-for-sidebar">
      <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={id} />
      <div className="page-content">
        <h3>Текущий проект - «{current_user_group?.project_name}»</h3>
        <h1>Просмотр статистики в проекте</h1>
        <p>Выберите вид диаграммы: <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="">Выберите вид диаграммы:</option>
            <option value="bar">Столбчатая</option>
            <option value="pie">Круговая</option>
          </select>
        </p>

        <p>
          Выберите детали диаграммы: <select value={chartDetail} onChange={(e) => setChartDetail(e.target.value)}>
            <option value="">Выберите детали диаграммы:</option>
            <option value="get_status">Распределение задач проекта по статусам</option>
            <option value="get_priority">Распределение задач проекта по приоритетам</option>
            <option value="get_underload">Наиболее незагруженные участники проекта</option>
            <option value="get_overload">Наиболее перегруженные участники проекта</option>
            <option value="get_user_tasks">Распределение задач выбранного пользователя</option>
          </select>
        </p>

        {/* Показываем селектор пользователя только если выбрана соответствующая опция */}
        {chartDetail === 'get_user_tasks' && (
          <p>
            Выберите пользователя: <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Выберите пользователя:</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.username})
                </option>
              ))}
            </select>
          </p>
        )}

        <Button onClick={handleShowChart}>Показать диаграмму</Button>
      { chartVisible && (
      <div style={{ marginTop: '30px' }}>
        {chartData.length === 0 ? (
          <p>Данные о заданиях в системе не найдены.</p>
        ) : chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                name="Количество задач"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#2F2F2F"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#857a7b', '#585858', '#728380', '#A9A9A9', '#76797f', '#827973', '#707f85'][index % 7]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#707f85" name="Количество задач"/>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>)}
      </div>
    </div>
  );
};

export default StatisticsPage;
