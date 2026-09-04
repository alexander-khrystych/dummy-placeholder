import Posts from "./resources/posts";

export default class JsonPlaceholderClient {
    baseUrl = process.env.JSON_PLACEHOLDER_BASE_URL
    posts

    constructor() {
        this.posts = new Posts(this.baseUrl)
    }
}