import HttpBase from "../../../http-client-base/http-base";

export default class Posts extends HttpBase {
    constructor (baseUrl) {
        super(baseUrl)
    }
    
    async getPost({ id, headers }) {
        return await this.get(`/posts/${id}`, { headers })
    }

    async create({ body, headers }) {
        return await this.post('/posts', { body, headers })
    }

    async edit({ id, body, headers }) {
        return await this.put(`/posts/${id}`, {body, headers })
    }
}