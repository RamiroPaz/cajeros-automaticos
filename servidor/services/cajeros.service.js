const cajeros = require('../utils/cajeros-automaticos.json')
const haversine = require('haversine-distance')

exports.cajerosCercanos = (clientCoord, atmNet) => {
    const coord = clientCoord.split(',')
    var results = []
    cajeros.map(atm => {
        var harvesineResult = 
            haversine(
                {
                    latitude: coord[0],
                    longitude: coord[1]
                }, 
                {
                    latitude: atm.lat,
                    longitude: atm.long
                }
            )
        if (atmNet.toLowerCase() == atm.red.toLowerCase() && harvesineResult<500){
            atm.haversine = harvesineResult
            results.push(atm)
        }
    })
    results.sort((a,b) => a.haversine - b.haversine)
    return results.slice(0,3)
}
