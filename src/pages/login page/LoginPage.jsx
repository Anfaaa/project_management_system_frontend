// LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../../API/usersAPI.js';
import { useTheme } from '../../ThemeContext';
import Button from "../../components/button/Button.jsx";
import BackIcon from "../../components/icons/BackIcon.jsx";
import "./login-page.css";
import "../../styles/form.css"
import "../../styles/form-page.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const { setTheme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');
        
        try {
            const response = await UserLogin({ username, password });

            console.log('Вход успешен:', response.data);
            setSuccessMessage('Вход прошел успешно!');
            setTheme(response.data.theme_preference);

            Object.keys(response.data).forEach(key => {
                if (response.data[key] !== undefined)
                  localStorage.setItem(key, response.data[key]);
            });
            
            navigate('/projects-list');
        } 
        catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.username || errorData.password)
                    setErrorMessage(errorData.username || errorData.password);

                else if (errorData.blocked)
                    setErrorMessage(errorData.blocked);

                else setErrorMessage("Неизвестная ошибка входа, попробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return (
        <div className='login-page form-page'>
            <BackIcon onClick={() => navigate('/')} />
            <div className='form-container'>
                <h2>Вход в систему</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <label htmlFor='username'>Логин:</label>
                        <input 
                            type='text'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='password'>Пароль:</label>
                        <input 
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    <Button type='submit'>Войти</Button>
                    <p style={{textAlign: 'center'}} onClick={() => navigate('/password-reset')}>Забыли пароль?</p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;