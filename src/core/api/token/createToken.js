import { httpClient } from '../httpClient'

export function createToken({ email, password }) {
    return httpClient.post('/token/', { email, password })
}
