import HttpBase from "../../../http-client-base/http-base";

export default class Posts extends HttpBase {
    constructor (baseUrl) {
        super(baseUrl)
    }
    
    async getPost({ id, headers }) {
        return await this.request(
            'GET', `/posts/${id}`,
            { headers }
        )
    }
    
    async create({ headers, data }) {
        return await this.request(
            'POST', '/posts/',
            { headers, data }
        )
    }
    
    async edit({ id, headers, data }) {
        return await this.request(
            'PUT', `/posts/${id}`,
            { headers, data }
        )
    }
}