import { describe, test, expect } from '@jest/globals'
import _ from 'lodash'
import '../../utils/custom-matchers'
import JsonPlaceholderClient from "../../clients/json-placeholder/client"
import { randomPostBody } from '../../data/dummy-data'
import { validateSchema } from '../../utils/schema-validator'
import { jsonPlaceholderSchemaPaths as schemaPaths } from '../../data/constants'

describe('POST /posts', () => {
    let client
    beforeEach(() => {
        client = new JsonPlaceholderClient()
    })

    test('201 schema validation', async () => {
        const res = await client.posts.create({ data: randomPostBody() })
        expect(res).toHaveStatus(201)
        const { errors } = validateSchema(schemaPaths.posts.POST[201], res.data)
        expect(errors).toBeNull()
    })

    test('data in response reflects data sent in request', async () => {
        const reqBody = randomPostBody()
        const res = await client.posts.create({ data: reqBody })
        expect(res).toHaveStatus(201)
        expect(_.pick(res.data, ['title', 'body', 'userId'])).toEqual(reqBody)
        expect(_.isInteger(res.data.id)).toBe(true);
    })

    test('malformed body is rejected with 400', async () => {
        const invalidBody = _.omit(randomPostBody(), 'title')
        const res = await client.posts.create({ data: invalidBody })
        expect(res).toHaveStatus(400)
    })

    test('incorrect content-type is rejected with 415', async () => {
        const res = await client.posts.create({
            data: randomPostBody(),
            headers: { 'Content-Type': 'application/xml' },
        })
        expect(res).toHaveStatus(415)
    })

    test('unparsable payload is rejected with 400', async () => {
        const brokenBody = '{ "title":'
        const res = await client.posts.create({
            data: brokenBody,
            headers: { 'Content-Type': 'application/json' },
        })
        expect(res).toHaveStatus(400)
    })
})

describe('PUT /posts/{id}', () => {
    const client = new JsonPlaceholderClient(process.env.JSON_PLACEHOLDER_BASE_URL)

    test('can edit an existing post using valid payload', async () => {
        const res = await client.posts.edit({ id: 2, data: randomPostBody() })
        expect(res).toHaveStatus(200)
    })

    test('data in response reflects data sent in request', async () => {
        const reqOpts = {
            id: 3,
            data: randomPostBody(),
        }
        const res = await client.posts.edit({ id: reqOpts.id, data: reqOpts.body })
        expect(res).toHaveStatus(200)
        expect(res.data).toEqual({...reqOpts.body, id: reqOpts.id})
    })

    test('malformed body is rejected with 400', async () => {
        const res = await client.posts.edit({ 
            id: 4,
            data: { foo: "bar" },
        })
        expect(res).toHaveStatus(400)
    })

    test('incorrect content-type is rejected with 415', async () => {
        const res = await client.posts.edit({
            id: 5,
            data: randomPostBody(),
            headers: { 'Content-Type': 'application/xml' },
        })
        expect(res).toHaveStatus(415)
    })

    test('unparsable payload is rejected with 400', async () => {
        const brokenPayload = '{ "title":'
        const res = await client.posts.edit({
            id: 6,
            data: brokenPayload,
            headers: { 'Content-Type': 'application/json' },
        })
        expect(res).toHaveStatus(400)
    })
})