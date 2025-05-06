// ConfirmResetPassword.jsx

import { useState } from 'react';
import { PasswordResetConfirm } from '../../API';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../components/button/Button.jsx";
import BackIcon from "../../components/BackIcon.jsx";
import "./login-page.css";
import "../../styles/form.css"
import "../../styles/form-page.css";

const ConfirmResetPassword = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        if (newPassword !== passwordRepeat) {
        setErrorMessage('Пароли не совпадают');
        return;
        }

        try {
            await PasswordResetConfirm(uidb64, token, { new_password: newPassword });
            setSuccessMessage('Пароль успешно изменен!');
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.wrong_token)
                    setErrorMessage(errorData.wrong_token);
                else if (errorData.bad_url)
                    setErrorMessage(errorData.bad_url);
                else setErrorMessage("Неизвестная ошибка, попробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };

    return (
        <div className='login-page form-page'>
            <BackIcon onClick={() => navigate('/login')} />
            <div className='form-container'>
                <h2>Форма замены пароля</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <label htmlFor="newPassword">Новый пароль:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-row'>
                        <label htmlFor="passwordRepeat">Повторите новый пароль:</label>
                        <input
                            type="password"
                            id="passwordRepeat"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    <Button type='submit'>Сохранить новый пароль</Button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmResetPassword;
