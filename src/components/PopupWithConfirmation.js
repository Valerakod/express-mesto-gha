import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function PopupWithConfirmation(props) {
  function handleSubmit(evt) {
    evt.preventDefault();
  }

  return (
    <PopupWithForm
      name="delete"
      title="Вы уверены?"
      buttonText="Да"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
