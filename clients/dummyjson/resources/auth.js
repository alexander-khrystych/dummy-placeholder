import HttpBase from "../../../http-client-base/http-base";

export default class Auth extends HttpBase {
    constructor (baseUrl, jwt) {
        super(baseUrl, jwt)
    }

    async login({ body, headers }) {
        return await this.post('/auth/login', { body, headers })
    }

    async getCurrentAuthUser({ headers } = {}) {
        return await this.get('/auth/me', { headers })
    }
}