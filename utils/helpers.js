import _ from 'lodash';

/**
 * Builds an error message. Has to be used specifically with http requests.
 * @param {*} error - `Error` object
 * @param {*} expectedStatus - expected status for the request that has thrown an error
 * @returns 
 */
export function formatHttpError(error, expectedStatus) {
    const extractProp = (targetObj, title) => {
        if (_.isNil(targetObj) || targetObj === '') {
            return null
        }
        if (_.isString(targetObj)) {
            try {
                return `${title}: ${JSON.stringify(JSON.parse(targetObj), null, 2)}`
            } catch {
                return `${title}: ${targetObj}`
            }
        }
        return `${title}: ${JSON.stringify(targetObj, null, 2)}`
    }

    let formattedError = ''
    try {
        const errorData = {
            message: `${error.config.method.toUpperCase()} ${error.config.url} received unexpected status`,
            status: `expected: ${expectedStatus}; received: ${error.status};`,
            reqHeaders: extractProp(error.config.headers, 'req headers'),
            reqBody: extractProp(error.config.data, 'req body'),
            resHeaders: extractProp(error.headers, 'res headers'),
            resBody: extractProp(error.data, 'res body'),
        }
        formattedError = _.join(_.reject(_.values(errorData), _.isNil), '\n')
    } catch {
        formattedError = error
    }   

    return formattedError
}

export async function waitFor(ms) {
    await new Promise(resolve => setTimeout(() => {
        resolve()
    }, ms))
}
