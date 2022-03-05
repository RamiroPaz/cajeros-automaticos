const { response, request } = require('express');
const cajeroService = require('../services/cajeros.service.js')

exports.cajeros = async (req = request, res = response) => {
    const {coord, network} = req.body
    const cajeros = cajeroService.cajerosCercanos(coord, network)
    const response = cajeros.map(atm => ({banco: atm.banco, direccion: atm.ubicacion,latitude: atm.lat, longitude: atm.long}))
    res.json({
        response
    })
}