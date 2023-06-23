import React, { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({ onUpdateUser, isOpen, onClose }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  // После загрузки текущего пользователя из API его данные будут использованы в управляемых компонентах
  useEffect(() => {
    if (!isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      className="popup__form popup__form_profile"
      title={"Редактировать профиль"}
      name={"profile"}
      method="post"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={"Сохранить"}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__input-container">
        <label className="popup__field">
          <input
            className="popup__input popup-text-check-name"
            placeholder="Имя"
            type="text"
            onChange={handleNameChange}
            value={name || ""}
            name="name"
            required
            id="popup-name"
            minLength="2"
            maxLength="40"
          />
          <span
            className="popup__input-error popup-name-error"
            id="popup-name-error"
          ></span>
        </label>

        <label className="popup__field">
          <input
            className="popup__input popup-text-check-job"
            placeholder="Профессиональная деятельность"
            type="text"
            onChange={handleDescriptionChange}
            value={description || ""}
            name="about"
            required
            id="popup-job"
            minLength="2"
            maxLength="200"
          />
          <span
            className="popup__input-error popup-job-error"
            id="popup-job-error"
          ></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
