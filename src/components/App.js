import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import api from "../utils/Api.js";
import PopupWithConfirmation from "./PopupWithConfirmation.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip.js";
import ProtectedRoute from "./ProtectedRoute.js";
import auth from "../utils/Auth.js";
import Page404 from "./Page404.js";

function App() {
  const navigate = useNavigate();
  //стейты попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPopupWithConfirmation, setIsPopupWithConfirmation] = useState(false);

  const [selectedCard, setSelectedCard] = useState({ name: "", link: "" });

  const [currentUser, setCurrentUser] = useState({});

  const [cards, setCards] = useState([]);
  const [isInfoTooltip, setIsInfoTooltip] = useState(false);

  //стейт регистрации пользователя
  const [currentEmail, setCurrentEmail] = useState("");
  const [successRegister, setSuccessRegister] = useState(false);

  // стейт маршрутов
  const [currentRoute, setCurrentRoute] = useState("");

  //стейт логина
  const [loggedIn, setLoggedIn] = useState(false);

  //открытие попапов
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  //закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ name: "", link: "" });
    setIsPopupWithConfirmation(false);
    setIsInfoTooltip(false);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleRegisterClick() {
    setIsInfoTooltip(true);
  }

// получаем массив карточек
  useEffect(() => {
    if (loggedIn) {  
      
      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards);
          
        })
        .catch((err) => {
          console.log(`Ошибка! ${err}`);
        });
    }
  }, [loggedIn]);

  // получаем информацию о пользователе
  useEffect(() => {
    if (loggedIn) {
      
    api
      .getUserInfo()
      .then((userInfo) => {
        setCurrentUser(userInfo);
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
    }
  }, [loggedIn]);


  //смена информации о пользователе
  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
  }

  //смена аватара
  function handleUpdateAvatar(avatar) {
    api
      .setAvatar(avatar)
      .then((userAvatar) => {
        setCurrentUser(userAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
  }

  //управление лайками
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
  }
  //добавление карточек
  function handleAddCard({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
  }
  //удаление карточек
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(`Ошибка! ${err}`);
      });
  }

  // регистрация нового пользователя
  function handleRegister({ registerData, setRegisterData }) {
    auth
      .register(registerData)
      .then(() => {
        setSuccessRegister(true);
        setIsInfoTooltip(true);
        navigate("/signin");

        setRegisterData({
          email: "",
          password: "",
        });

        setTimeout(() => {
          setIsInfoTooltip(false);
        }, 1000);
      })
      .catch((err) => {
        setSuccessRegister(false);
        setIsInfoTooltip(true);
        setTimeout(() => {
          setIsInfoTooltip(false);
        }, 1000);

        console.log(`Ошибка! ${err}`);
      });
  }

  // авторизация
  function handleAuthorization({ loginData, setLoginData }) {
    auth
      .authorize(loginData)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          setCurrentEmail(loginData.email);
          navigate("/");
          localStorage.setItem("token", data.token);

          setLoginData({
            email: "",
            password: "",
          });
        }
      })

      .catch((err) => {
        setIsInfoTooltip(true);
        setSuccessRegister(false);
        console.log(`Ошибка! ${err}`);
      });
  }

  useEffect(() => {
    function handleTokenCheck() {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        auth
          .checkToken(token)
          .then((data) => {
            if (data) {
              setCurrentEmail(data.data.email);
              setLoggedIn(true);
              navigate("/");
            }
          })
          .catch((err) => {
            setIsInfoTooltip(true);
            setSuccessRegister(false);
            console.log(`Ошибка! ${err}`);
          });
      }
    }
    handleTokenCheck();
  }, []);

  //выход, удаление токена из локального хранилища
  function handleOutput() {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      navigate("/signin");
      setCurrentEmail("");
      setLoggedIn(false);
    }
  }

  return (
    <div className="App">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header
            email={currentEmail}
            onSignOut={handleOutput}
            currentRoute={currentRoute}
          />
          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    setCurrentRoute={setCurrentRoute}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/signup"
              element={
                <Register
                  setCurrentRoute={setCurrentRoute}
                  onRegister={handleRegister}
                  onInfoTooltip={handleRegisterClick}
                  successRegister={successRegister}
                />
              }
            />
            <Route
              exact
              path="/signin"
              element={
                <Login
                  setCurrentRoute={setCurrentRoute}
                  onLogin={handleAuthorization}
                  navigate={navigate}
                  loggedIn={loggedIn}
                />
              }
            />
            <Route path="/*" element={<Page404 />} />
          </Routes>

          {loggedIn && <Footer />}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <PopupWithConfirmation
            isOpen={isPopupWithConfirmation}
            onClose={closeAllPopups}
          />
          <ImagePopup onClose={closeAllPopups} card={selectedCard} />
          <InfoTooltip
            name="registration"
            isOpen={isInfoTooltip}
            onClose={closeAllPopups}
            registrationСompleted={successRegister}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
