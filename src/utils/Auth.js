class Auth {
    constructor({baseAuthUrl, headers }) {
        this.baseAuthUrl = baseAuthUrl;
        this.headers = headers
    };

    register(registerData) {
        return fetch(`${this.baseAuthUrl}/signup`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(registerData),
            })

        .then(this._checkError);
    }

    authorize(data) {
        return fetch(`${this.baseAuthUrl}/signin`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
            })

        .then(this._checkError);
    }

    checkToken(token) {
        return fetch(`${this.baseAuthUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .then(this._checkError);
    }

    _checkError(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }
}

const auth = new Auth({
    baseAuthUrl: 'https://auth.nomoreparties.co',
    headers: {'Content-Type': 'application/json'}
});

export default auth 