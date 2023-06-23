import Card from "./Card.js";
import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main({
  cards,
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  setCurrentRoute,
}) {
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setCurrentRoute("/");
  }, []);

  return (
    <main className="content">
      <section className="profile">
        <button
          className="profile__avatar"
          type="button"
          onClick={onEditAvatar}
        >
          <img
            className="profile__avatar-img"
            src={currentUser.avatar}
            alt="Аватар"
          />
        </button>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            className="profile__edit-button"
            type="button"
            aria-label="Редактировать профиль"
            onClick={onEditProfile}
          ></button>
          <p className="profile__job">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Добавить"
          onClick={onAddPlace}
        ></button>
      </section>

      <section className="elements">
        {cards
          ? cards.map((card) => {
              return (
                <Card
                  key={card._id}
                  card={card}
                  onCardClick={onCardClick}
                  onCardLike={onCardLike}
                  onCardDelete={onCardDelete}
                />
              );
            })
          : ""}
      </section>
    </main>
  );
}

export default Main;
