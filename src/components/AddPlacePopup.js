import React from "react";
import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ onAddCard, isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setLink("");
    }
  }, [isOpen]);

  function handleAddPlaceSubmit(evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddCard({
      name: title,
      link: link,
    });
  }

  function handleAddTitle(evt) {
    setTitle(evt.target.value);
  }

  function handleAddLink(evt) {
    setLink(evt.target.value);
  }

  return (
    <PopupWithForm
      className="popup__form popup__form_add"
      title={"Новое место"}
      name={"add-image"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleAddPlaceSubmit}
      buttonText={"Создать"}
      method="post"
    >
      <fieldset className="popup__input-container">
        <label className="popup__field">
          <input
            className="popup__input"
            placeholder="Название"
            type="text"
            name="title"
            required
            id="popup-placename"
            minLength="2"
            maxLength="30"
            value={title}
            onChange={handleAddTitle}
          />
          <span
            className="popup__input-error  popup-placename-error"
            id="popup-placename-error"
          ></span>
        </label>

        <label className="popup__field">
          <input
            className="popup__input"
            placeholder="Ссылка на картинку"
            type="url"
            name="link"
            required
            id="popup-source"
            value={link}
            onChange={handleAddLink}
          />
          <span
            className="popup__input-error  popup-source-error"
            id="popup-source-error"
          ></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
