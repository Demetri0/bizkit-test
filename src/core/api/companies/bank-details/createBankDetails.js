import { httpClient } from '../../httpClient'

export function createBankDetails(companyId, data) {
    return httpClient.post(`/companies/${companyId}/bank_details/`, data)
}
