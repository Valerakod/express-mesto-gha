class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  returnResultStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(
      `Что-то пошло не так: ${res.status} : ${res.statusText}`
    );
  }

  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      method: "GET",
      headers: this._headers,
    }).then(this.returnResultStatus);
  }

  setUserInfo(data) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this.returnResultStatus);
  }

  getInitialCards() {
    return fetch(this._baseUrl + "/cards", { headers: this._headers }).then(
      this.returnResultStatus
    );
  }

  addCard({ name, link }) {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this.returnResultStatus);
  }

  deleteCard(cardId) {
    console.log(cardId);
    return fetch(this._baseUrl + `/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this.returnResultStatus);
  }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/likes/${id}`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    }).then(this.returnResultStatus);
  }

  setAvatar(data) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this.returnResultStatus);
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-63",
  headers: {
    authorization: "5fcf59d4-83ea-4773-9206-282bfebd1adc",
    "Content-Type": "application/json",
  },
});

export default api;
