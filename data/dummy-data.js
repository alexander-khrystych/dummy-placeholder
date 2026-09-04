import { faker } from '@faker-js/faker';

export const randomPostBody = () => {
    return {
        "userId": faker.number.int({ min: 200, max: 999 }),
        "title": faker.lorem.words(4),
        "body": `${faker.lorem.words(5)}\n${faker.lorem.words(10)}`,
    }
}

export const creds = ({ valid = true, expiresInMins =1 } = {}) => {
    return valid 
    ? {
        username: process.env.DUMMYJSON_USER,
        password: process.env.DUMMYJSON_PASS,
        expiresInMins: expiresInMins ?? 1,
    } 
    : {
        username: 'foo',
        password: 'bar',
        expiresInMins: expiresInMins ?? 1,
    }
}