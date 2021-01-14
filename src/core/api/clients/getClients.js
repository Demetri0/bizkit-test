import { httpClient } from '../httpClient'

export function getClients() {
    return httpClient.get('/clients/')
}
