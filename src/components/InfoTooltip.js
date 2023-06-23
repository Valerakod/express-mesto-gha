import React from "react";
import successfully from "../images/successfully.svg";
import unsuccessfully from "../images/unsuccessfully.svg";

export default function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
      onClick={props.onClose}
    >
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="закрыть"
          onClick={props.onClose}
        ></button>
        <div className="popup__cont">
          <img
            src={props.registrationСompleted ? successfully : unsuccessfully}
            alt={props.registrationСompleted ? "успешно" : "неуспешно"}
            className="popup__icon"
          />
          <p className="popup__text">
            {props.registrationСompleted
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
        </div>
      </div>
    </div>
  );
}
