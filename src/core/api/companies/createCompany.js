import { httpClient } from '../httpClient'

export function createCompany(id, data) {
    return httpClient.post(`/companies/${id}/`, data)
}
