// ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetUserProfileInfo, ChangeUserProfileInfo, DeleteUserAccount } from '../../API/usersAPI.js';
import BackIcon from "../../components/icons/BackIcon.jsx";
import Button from "../../components/button/Button.jsx";
import "../../styles/form.css";
import '../../styles/form-page.css';
import './profile-page.css';
import { useTheme } from '../../ThemeContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    new_password: '',
    email: '',
    current_password: '',
    notifications_status: false, 
    theme_preference: false
  });

  useEffect(() => {
    const GetUserInfo = async () => {
      try {
        const response = await GetUserProfileInfo();

        console.log('Получены данные пользователя:', response.data);
        setUserData({
          ...response.data,
          current_password: '',
          new_password: ''
        });
      } 
      catch (error) {
          console.error('Ошибка при загрузке деталий проекта:', error);
          alert('Не удалось получить данные пользователя');
      }
  };

  GetUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    try {
      if (!userData.new_password)
        delete userData.new_password;

      if (!userData.current_password)
        delete userData.current_password;

      const response = await ChangeUserProfileInfo(userData);

      console.log('Получены обновленные данные пользователя:', response.data);
      localStorage.setItem('notifications_status', response.data.notifications_status);
      localStorage.setItem('username', response.data.username);

      setTheme(userData.theme_preference);

      alert('Данные успешно обновлены!');
    } 
    catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.wrong_password)
          setErrorMessage(errorData.wrong_password);

        else if (errorData.email)
          setErrorMessage(errorData.email);

        else if (errorData.username)
          setErrorMessage(errorData.username);

        else if (errorData.no_current_password) 
          setErrorMessage(errorData.no_current_password);

        else setErrorMessage("Неизвестная ошибка при изменении данных, \nпопробуйте позже.");
        }
      else setErrorMessage("Сервер не отвечает, попробуйте позже.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.');
    if (confirmDelete) {
      try {
        await DeleteUserAccount();

        alert('Аккаунт удален');
        navigate('/login');
      }
      catch (error) {
          alert('Ошибка при удалении аккаунта.');
      }
    }
  };

  return (
    <div className='profile-page form-page'>
    <BackIcon onClick={() => navigate(location.state?.from || `/projects-list`)} />
      <div className='form-container'>
        <h2>Профиль</h2>
        <form className='form' onSubmit={handleSubmit}>
          <div className='form-row'>
            <label htmlFor='username'>Логин:</label>
            <input 
              name='username'
              type='text'
              id='username'
              value={userData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-row'>
            <label htmlFor='email'>Email:</label>
            <input 
              name='email'
              type='email'
              id='email'
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-row'>
            <label htmlFor='first_name'>Имя:</label>
            <input 
              name='first_name'
              type='text'
              id='first_name'
              value={userData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-row'>
            <label htmlFor='last_name'>Фамилия:</label>
            <input 
              name='last_name'
              type='text'
              id='last_name'
              value={userData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='form-row'>
            <label htmlFor='notifications_status'>Включить уведомления? </label>
            <input
              name="notifications_status"
              type='checkbox'
              id='notifications_status'
              checked={userData.notifications_status}
              onChange={(e) => setUserData((prevData) => ({
                ...prevData,
                notifications_status: !prevData.notifications_status,
              }))}
            />
          </div>
          <div className='form-row'>
            <label htmlFor='theme_preference'>Включить темную тему? </label>
            <input
              name="theme_preference"
              type='checkbox'
              id='theme_preference'
              checked={userData.theme_preference}
              onChange={(e) => setUserData((prevData) => ({
                ...prevData,
                theme_preference: !prevData.theme_preference,
              }))}
            />
          </div>
          <p>
            <strong>Изменение пароля</strong>
          </p>
          <div className='form-row'>
            <label htmlFor='current_password'>Текущий пароль:</label>
            <input 
              name='current_password'
              type='password'
              id='current_password'
              value={userData.current_password}
              onChange={handleInputChange}
            />
          </div>
          <div className='form-row'>
            <label htmlFor='new_password'>Новый пароль:</label>
            <input 
              name='new_password'
              type='password'
              id='new_password'
              value={userData.new_password}
              onChange={handleInputChange}
            />
          </div>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <Button type='submit'>Сохранить изменения</Button>
          <Button onClick={handleDeleteAccount}>Удалить аккаунт</Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;