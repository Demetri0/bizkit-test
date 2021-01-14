import { httpClient } from '../httpClient'

export function getClients({ page }) {
    return httpClient.get('/clients/', { params: { page } })
}
