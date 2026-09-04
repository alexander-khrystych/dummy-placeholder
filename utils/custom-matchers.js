import { expect } from '@jest/globals'
import { formatHttpError } from './helpers'

function toHaveStatus(res, expectedStatus) {
    const pass = res.status === expectedStatus
    if (pass) {
        return {
            message: () => formatHttpError(res, expectedStatus),
            pass: true,
        }
    } else {
        return {
            message: () => formatHttpError(res, expectedStatus),
            pass: false,
        }
    }
}

expect.extend({
    toHaveStatus,
})