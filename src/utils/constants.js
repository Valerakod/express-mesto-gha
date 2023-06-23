//вызов валидации
export const selectors = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__save-button",
  inactiveButtonClass: "popup__save-button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active"
}

//кнопки, формы, инпуты
export const editButton = document.querySelector(".profile__edit-button");
export const formElementEdit = document.querySelector(".popup__form_profile");
export const formElementAdd = document.querySelector(".popup__form_add");
export const nameInput = document.querySelector(".popup-text-check-name");
export const jobInput = document.querySelector(".popup-text-check-job");
export const profileName = document.querySelector(".profile__name");
export const profileJob = document.querySelector(".profile__job");
export const profileAvatar = document.querySelector(".profile__avatar-img")
export const addButton = document.querySelector(".profile__add-button");
export const profileAvatarEditButton = document.querySelector(".profile__avatar");
export const deleteElement = document.querySelector(".element__delete-icon");
export const popupDeleteConfirmation = document.querySelector(".popup_element_delete-card");

