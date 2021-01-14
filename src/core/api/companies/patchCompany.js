import { httpClient } from '../httpClient'

export function patchCompany(id, data) {
    return httpClient.patch(`/companies/${id}/`, data)
}
