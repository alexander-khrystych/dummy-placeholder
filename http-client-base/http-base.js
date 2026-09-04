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

    async get(path, opts) {
        return await this.#http.get(
            path,
            {
                headers: opts?.headers,
                params: opts?.params,
            }
        )
    }

    async post(path, opts) {
        return await this.#http.post(
            path,
            opts.body,
            { headers: opts.headers },
        )
    }

    async put(path, opts) {
        return await this.#http.put(
            path,
            opts.body,
            { headers: opts.headers },
        )
    }
}
