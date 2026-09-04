import { describe, test, expect } from '@jest/globals'
import _ from 'lodash'
import '../../utils/custom-matchers'
import DummyJsonClient from '../../clients/dummyjson/client'

describe('GET /users', () => {
    let client
    beforeEach(() => {
        client = new DummyJsonClient()
    })
    
    test('by default the list limit is 30', async () => {
        const res = await client.users.getUsers()
        expect(res).toHaveStatus(200)
        expect(res.data.limit).toEqual(30)
        expect(res.data.users).toHaveLength(30)
    })

    test('"limit=0" returns a complete list of all users', async () => {
        const res = await client.users.getUsers({ params: {limit: 0} })
        expect(res).toHaveStatus(200)
        const totalUsers = res.data.total
        expect(res.data.limit).toEqual(totalUsers)
        expect(res.data.users).toHaveLength(totalUsers)
    })
    
    test('"select" only shows selected props on listed users', async () => {
        const selectProps = ['firstName', 'age']
        const params = { select: _.join(selectProps, ',') }
        const res = await client.users.getUsers({ params: params })
        expect(res).toHaveStatus(200)
        res.data.users.forEach(user => {
            expect(_.xor( _.keys(user), _.concat(selectProps, 'id') )).toEqual([]);
        });
    })

    test('"skip" skips the correct number of users', async () => {
        const params = { skip: 10 }
        const res = await client.users.getUsers({ params: params })
        expect(res).toHaveStatus(200)
        expect(res.data.skip).toBe(params.skip)
        const allIds = _.map(res.data.users, 'id')
        const outOfRangeIds = _.filter(allIds, id => id < 11 && id > 41)
        expect(outOfRangeIds).toEqual([])
    })
    
    test('negative "limit" value returns 400', async () => {
        const res = await client.users.getUsers({ params: {limit: -1} })
        expect(res).toHaveStatus(400)
        expect(res.data.message).toContain("Invalid 'limit'")
    })
})