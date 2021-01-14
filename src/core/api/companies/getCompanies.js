import { httpClient } from '../httpClient'

export function getCompanies({ page }) {
    return httpClient.get('/companies/', { params: { page } })
}
