import logo from "../images/logo.png";
import React from "react";
import { Route, Routes, Link } from "react-router-dom";

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <div className="header__container">
        <p className="header__email">{email}</p>
        <Routes>
          <Route
            path="/signin"
            element={
              <Link to="/signup" className="header__link">
                Регистрация
              </Link>
            }
          />
          <Route
            path="/signup"
            element={
              <Link to="/signin" className="header__link">
                Войти
              </Link>
            }
          />
          <Route
            path="/"
            element={
              <Link to="/signin" className="header__link" onClick={onSignOut}>
                Выйти
              </Link>
            }
          />
        </Routes>
      </div>
    </header>
  );
}

export default Header;
