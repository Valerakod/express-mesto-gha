import { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ onUpdateAvatar, isOpen, onClose }) {
  const avatarRef = useRef("");

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value, //Значение инпута, полученное с помощью рефа
    });
  }

  return (
    <PopupWithForm
      className="popup__form popup__form_avatar"
      title={"Обновить аватар"}
      name={"avatar-form"}
      isOpen={isOpen}
      onClose={onClose}
      buttonText={"Сохранить"}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__input-container">
        <label className="popup__field">
          <input
            className="popup__input"
            ref={avatarRef}
            type="url"
            name="avatar"
            placeholder="Ссылка на аватар"
            id="popup-avatar"
            required
          />
          <span
            className="popup__input-error popup-avatar-error"
            id="popup-avatar-error"
          ></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
