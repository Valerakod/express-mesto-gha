import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = `element__delete-icon ${
    isOwn ? "element__delete-icon_visible" : ''
}`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__heart ${
    isLiked && "element__heart_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card);
  }
  return (
    <article className="element">
      <img
        className="element__image"
        src={card?.link}
        alt={card?.name}
        onClick={handleClick}
      />
      <h2 className="element__text">{card?.name}</h2>
      <div className="element__like">
        <button
          className={cardLikeButtonClassName}
          type="button"
          aria-label="Поставить лайк"
          onClick={handleLikeClick}
        ></button>
        <p className="element__heart-count">{card?.likes.length}</p>
      </div>
     
        <button
          className={cardDeleteButtonClassName}
          type="button"
          aria-label="Удалить"
          onClick={handleDeleteClick}
        ></button>
      
    </article>
  );
}

export default Card;
