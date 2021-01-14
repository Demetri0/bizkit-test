import { httpClient } from '../../httpClient'

export function getBankDetails({ companyId, ordering, search, page }) {
    return httpClient.get(`/companies/${companyId}/bank_details/`, {
        params: {
            page,
            ordering,
            search,
        }
    })
}
