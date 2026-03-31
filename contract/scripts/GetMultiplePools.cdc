import PeliFi from "PeliFi"
import PeliFiTypes from "PeliFiTypes"

access(all) fun main(ids: [UInt64]): {UInt64: PeliFiTypes.PoolDetails} {
    let allDetails: {UInt64: PeliFiTypes.PoolDetails} = {}

    for id in ids {
        // Ambil detail, jika ada (tidak nil), masukkan ke dictionary
        if let details = PeliFi.getPoolDetails(poolId: id) {
            allDetails[id] = details
        }
    }

    return allDetails
}