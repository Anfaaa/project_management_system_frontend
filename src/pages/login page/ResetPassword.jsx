// ResetPassword.jsx

import { useState } from 'react';
import { PasswordReset } from '../../API';
import { useNavigate } from 'react-router-dom';
import Button from "../../components/button/Button.jsx";
import BackIcon from "../../components/BackIcon.jsx";
import "./login-page.css";
import "../../styles/form.css"
import "../../styles/form-page.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        try {
            await PasswordReset({ email });
            setSuccessMessage('На указанный email отправлено письмо с инструкциями по восстановлению пароля.');
        } catch (error) {
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.no_user)
                    setErrorMessage(errorData.no_user);
                else setErrorMessage("Неизвестная ошибка, попробуйте позже.");
            }
            else setErrorMessage("Сервер не отвечает, попробуйте позже.");
        }
    };
    return (
        <div className='login-page form-page'>
            <BackIcon onClick={() => navigate('/login')} />
            <div className='form-container'>
                <h2>Восстановление пароля</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='form-row'>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type='text'
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                    <Button type='submit'>Отправить ссылку для восстановления</Button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;