import { httpClient } from '../../httpClient'

export function patchBankDetails(companyId, id, data) {
    return httpClient.patch(`/companies/${companyId}/bank_details/${id}/`, data)
}
