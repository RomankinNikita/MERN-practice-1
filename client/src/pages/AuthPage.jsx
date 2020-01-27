import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";

const initialForm = {
  email: "",
  password: ""
};

export const AuthPage = () => {
  const {login} = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistration = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      setForm(initialForm);
      message(data.message);
    } catch (error) {}
  };

  const handleLogin = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      login(data.token, data.userId);
      setForm(initialForm);
    } catch (error) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи ссылку</h1>
        <div className="card deep-purple lighten-3">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  className="custom-input"
                  onChange={handleChange}
                  value={form.email}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  className="custom-input"
                  onChange={handleChange}
                  value={form.password}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn deep-purple darken-4"
              style={{ marginRight: 10 }}
              onClick={handleLogin}
              disabled={loading}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              onClick={handleRegistration}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
