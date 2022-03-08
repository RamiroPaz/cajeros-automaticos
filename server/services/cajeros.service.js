const cajeros = require('../utils/cajeros-automaticos.json')
const haversine = require('haversine-distance')

exports.cajerosCercanos = (clientLatitud, clientLongitude, atmNet) => {
    let max, mid, min
    cajeros.map((atm) => {
        if (atmNet.toLowerCase() == atm.red.toLowerCase()){
            let harvesineResult = 
                haversine({latitude: clientLatitud, longitude: clientLongitude}, 
                          {latitude: atm.lat,longitude: atm.long})

            if(harvesineResult<500){
                atm.haversine = harvesineResult
                if(min === undefined || atm.haversine < min.haversine){
                    max = mid
                    mid = min
                    min = atm
                }else if(mid === undefined || atm.haversine < mid.haversine){
                    max = mid
                    mid = atm
                }else if(max === undefined || atm.haversine < max.haversine){
                    max = atm
                }
            }
        }
    })
    let results = [min, mid, max]
    return results.filter(atm => atm != undefined)
}
