import { httpClient } from '../httpClient';

export function getMe() {
    return httpClient.get('/users/me')
}
