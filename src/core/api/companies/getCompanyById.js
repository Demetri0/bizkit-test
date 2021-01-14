import { httpClient } from '../httpClient'

export function getCompanyById(id) {
    return httpClient.get(`/companies/${id}/`)
}
