import axios from "axios";

export default class HttpBase {
    #baseUrl
    #http

    constructor(baseUrl, jwt) {
        this.#baseUrl = baseUrl
        this.#http = axios.create({
            baseURL: this.#baseUrl,
            headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
            validateStatus: () => true,
        })
    }

    async request(method, path, opts) {
        return await this.#http.request({
            url: path,
            method: method,
            params: opts?.params,
            headers: opts?.headers,
            data: opts?.data,
        })
    }
}
