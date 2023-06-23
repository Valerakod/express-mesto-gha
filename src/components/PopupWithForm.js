import React, { useEffect } from "react";

function PopupWithForm({ title, name, children, isOpen, onClose, buttonText, onSubmit }) {
  const className = `popup  popup_type_${name} ${
    isOpen ? "popup_opened" : " "
  }`;
  
  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscClose);
      return () => document.removeEventListener("keydown", handleEscClose);
    }
  }, [isOpen]);

  return (
    <div className={className} onClick={onClose}>
      <div className="popup__container" onClick={(e) => e.stopPropagation()}>
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button className="popup__save-button " type="submit">
            {buttonText}
          </button>
        </form>
        <button
          className="popup__close-button popup__close-button_edit"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
