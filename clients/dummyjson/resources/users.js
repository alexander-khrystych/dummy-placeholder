import HttpBase from "../../../http-client-base/http-base";

export default class Users extends HttpBase {
    constructor (baseUrl) {
        super(baseUrl)
    }

    async getUsers({ headers, params } = {}) {
        return await this.request(
            'GET', '/users',
            { headers, params },
        )
    }
}