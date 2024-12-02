import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Название кнопки и заголовка
    const name = method === "login" ? "Log in" : "Registration";

    // Переключение между Login и Registration
    const handleNavigate = () => {
        if (method === "login") {
            navigate("/register");
        } else {
            navigate("/login");
        }
    };

    // Обработка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                // Сохраняем токены после логина
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home"); // Переход на главную
            } else if (method === "register") {
                // После регистрации перенаправляем на главную
                if (res.status === 201) {
                    navigate("/home");
                }
            }
        } catch (error) {
            alert("Error: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body-first-page">
            <div className="first-page-container">
            <div className="login-btn-container">
                <h1 className="welcome-text">Welcome to <br/> WheelOfLife</h1>
                <button className="login-btn" type="button" onClick={handleNavigate}>
                    {method === "login" ? "Registration" : "Log in"}
                </button>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="form-container">
                    <h1 className="form-input-h1">{name}</h1>
                    <input
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    {loading && <LoadingIndicator />}
                    <div className="form-btn-container">
                        <button className="form-button" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}

export default Form;
