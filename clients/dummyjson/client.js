import Auth from "./resources/auth";
import Users from "./resources/users";

export default class DummyJsonClient {
    baseUrl = process.env.DUMMYJSON_BASE_URL
    auth
    users

    constructor(jwt) {
        this.auth = new Auth(this.baseUrl, jwt)
        this.users = new Users(this.baseUrl, jwt)
    }

    /**
     * DummyJsonClient factory.
     * Authenticates, extracts jwt, creates and returns an instance of DummyJsonClient 
     * with jwt injected into http-base client.
     * Call example:
     * const client = await DummyJsonClient.auth(creds)
     * await client.auth.getCurrentAuthUser() <- returns user details associated with `creds`
     * @param {*} creds - a valid req body for POST /auth/login
     * @returns 
     */
    static async auth(creds) {
        console.log(JSON.stringify(creds, null, 2))
        const authRes = await new Auth(this.baseUrl).login({ body: creds })
        return new DummyJsonClient(authRes.data.accessToken)
    }
}