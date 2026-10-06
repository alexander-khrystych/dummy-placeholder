import HttpBase from "../../../http-client-base/http-base";

export default class Auth extends HttpBase {
    constructor (baseUrl, jwt) {
        super(baseUrl, jwt)
    }

    async login({ headers, data }) {
        return await this.request(
            'POST', '/auth/login', 
            { headers, data }
        )
    }
    
    async getCurrentAuthUser({ headers }) {
        return await this.request(
            'GET', '/auth/me',
            { headers }
        )
    }
}