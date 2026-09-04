import 'dotenv/config'
import axios from 'axios'
import { waitFor } from './utils/helpers'

const URLS = {
    dummyJson: `${process.env.DUMMYJSON_BASE_URL}/test`,
    jsonPlaceholder: `${process.env.JSON_PLACEHOLDER_BASE_URL}/posts`
}

async function healthcheck(url) {
    const reqTimeout = 5 * 1000
    const retryTimeout = 5 * 1000
    const maxAttempts = 5
    let lastError

    for (let i = 0; i < maxAttempts; i++) {
        try {
            const res = await axios.get(
                url,
                {
                    timeout: reqTimeout,
                    validateStatus: (status) => status >= 200 && status <= 300,
                },
            )
            console.log(`\n[INFO] Service has been reached on attempt #${i+1}\nGET ${url}\nResponse: ${res.status}`)
            return
        } catch (e) {
            lastError = e
            console.log(
                ((error) => {
                    const attemptsCount = `(${i+1}/${maxAttempts})`
                    const details = error.status && error.code
                        ? `Response: ${error.status} - ${error.code}`
                        : `${error.message}`
                    return `\n[WARN] ${attemptsCount} Healthcheck failed.\nGET ${url}\n${details}`
                })(lastError)
            )
            if (i < maxAttempts - 1) await waitFor(retryTimeout)
        }
    }
    
    throw new Error(
        ((error) => {
            const details = error.status && error.code
                    ? `Response: ${error.status}: ${error.code}`
                    : `${error.message}`
            return `\n\n[ERRO] Failed to reach target service after ${maxAttempts} attempts. Last attempt:\nGET ${url}\n${details}\n`
        })(lastError)
    )
}

export default async function globalSetup() {
    for (const url of Object.values(URLS)) {
        await healthcheck(url)
    }
}