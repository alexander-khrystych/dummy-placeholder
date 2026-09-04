export const data = {
}

/**
 * a collection of relative paths from "/schemas" dir for json-placeholder service schemas
 */
export const jsonPlaceholderSchemaPaths = {
    posts: {
        POST: {
            201: '/json-placeholder/posts/POST/201.yaml',
        },
    },
}

/**
 * a collection of relative paths from "/schemas" dir for dummyjson service schemas
 */
export const dummyJsonSchemaPaths = {
    auth: {
        login: {
            POST: {
                200: '/dummyjson/auth/login/POST/200.yaml',
            },
        }
    },
}