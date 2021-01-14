import { httpClient } from '../httpClient'

export function deleteCompany({ id }) {
    return httpClient.delete('/companies/' + id)
}
