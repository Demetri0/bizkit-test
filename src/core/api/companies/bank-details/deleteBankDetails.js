import { httpClient } from '../../httpClient'

export function deleteBankDetails(companyId, id) {
    return httpClient.delete(`/companies/${companyId}/bank_details/${id}/`)
}
