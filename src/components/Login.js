import React from "react";
import { useEffect, useState } from "react";

export default function Login({ setCurrentRoute, onLogin }) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleChangeLoginData(evt) {
    const { name, value } = evt.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onLogin({ loginData, setLoginData });
  }

  useEffect(() => {
    setCurrentRoute("/signin");
  }, []);

  return (
    <div className="page">
      <div className="login">
        <h2 className="login__title">Вход</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label">
            <input
              className="login__input"
              type="email"
              name="email"
              id="email-input"
              placeholder="Email"
              minLength="6"
              maxLength="30"
              required
              value={loginData.email || ""}
              onChange={handleChangeLoginData}
            />
            <span className="login__input-error email-input-error form__input-error"></span>
          </label>
          <label className="login__label">
            <input
              className="login__input"
              type="password"
              name="password"
              id="password-input"
              placeholder="Пароль"
              minLength="6"
              maxLength="30"
              required
              value={loginData.password || ""}
              onChange={handleChangeLoginData}
            />
            <span className="login__input-error password-input-error form__input-error"></span>
          </label>
          <button className="login__button" type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
