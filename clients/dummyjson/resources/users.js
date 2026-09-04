import HttpBase from "../../../http-client-base/http-base";

export default class Users extends HttpBase {
    constructor (baseUrl) {
        super(baseUrl)
    }

    async getUsers({ params, headers } = {}) {
        return await this.get('/users', { params, headers })
    }
}