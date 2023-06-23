import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <article
      className={`popup popup-img popup_dark ${card?.link && "popup_opened"} `}
    >
      <div className="popup__element">
        <figure className="figure">
          <img
            className="popup__element-image"
            src={card?.link}
            alt={card?.name}
          />
          <figcaption className="popup__element-text">К{card?.name}</figcaption>
        </figure>
        <button
          className="popup__close-button popup__close-button_img"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
      </div>
    </article>
  );
}

export default ImagePopup;
