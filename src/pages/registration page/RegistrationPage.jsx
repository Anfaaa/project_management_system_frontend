// RegistrationPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRegistration } from '../../API/usersAPI.js';
import Button from "../../components/button/Button.jsx";
import BackIcon from "../../components/icons/BackIcon.jsx";
import "./registration-page.css";
import "../../styles/form.css";
import "../../styles/form-page.css";

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordRepeat){
            setErrorMessage('Пароли не совпадают!');
            return;
        }

        setErrorMessage('');
        
        try {
            const response = await UserRegistration({
                username,
                email,
                first_name: firstName,
                last_name: lastName,
                password,
            });

            console.log('Регистрация успешна:', response.data);
            navigate('/login');
        } 
        catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.email)
                    setErrorMessage(errorData.email);

                else if (errorData.username)
                    setErrorMessage(errorData.username);

                else setErrorMessage("Неизвестная ошибка регистрации, попробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return(
        <div className='registration-page form-page'>
            <BackIcon onClick={() => navigate('/')} />
            <div className='form-container'>
                <h2>Регистрация</h2>
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
                        <label htmlFor='email'>Email:</label>
                        <input 
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='firstName'>Имя:</label>
                        <input 
                            type='text'
                            id='firstName'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor='lastName'>Фамилия:</label>
                        <input 
                            type='text'
                            id='lastName'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                    <div className='form-row'>
                        <label htmlFor='passwordRepeat'>Повторите пароль:</label>
                        <input 
                            type='password'
                            id='passwordRepeat'
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    <Button type='submit'>Зарегестрироваться</Button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;