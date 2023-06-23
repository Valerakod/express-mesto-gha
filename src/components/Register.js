import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Register({ setCurrentRoute, onRegister }) {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  function handleChangeRegisterData(evt) {
    const { name, value } = evt.target;

    setRegisterData({
      ...registerData,
      [name]: value,
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister({ registerData, setRegisterData });
  }

  useEffect(() => {
    setCurrentRoute("/signup");
  }, []);

  return (
    <div className="page">
      <div className="register">
        <h2 className="register__title">Регистрация</h2>
        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__label">
            <input
              className="register__input"
              type="email"
              name="email"
              value={registerData.email || ""}
              onChange={handleChangeRegisterData}
              id="email-input"
              placeholder="Email"
              minLength="6"
              maxLength="30"
              required
            />
            <span className="register__input-error email-input-error form__input-error"></span>
          </label>
          <label className="register__label">
            <input
              className="register__input"
              type="password"
              name="password"
              value={registerData.password || ""}
              onChange={handleChangeRegisterData}
              id="password-input"
              placeholder="Пароль"
              minLength="6"
              maxLength="30"
              required
            />
            <span className="register__input-error password-input-error form__input-error"></span>
          </label>
          <button className="register__button" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <div className="register__container">
          <p className="register__text">Уже зарегистрированы?</p>
          <Link className="register__link" to="/signin">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
