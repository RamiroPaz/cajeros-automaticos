const { response, request } = require('express');
const cajeroService = require('../services/cajeros.service.js')
// Hardcoded networks
const availableNetworks = ["BANELCO", "LINK"]

exports.cajeros = async (req = request, res = response) => {
    const {latitude, longitude, network} = req.body

    // some validations
    if(!latitude || !longitude || !network){
        res.status(400).send('Invalid parameters')
        return
    }

    const isValidCoord = (num) => {
        return isFinite(num) && Math.abs(num) <= 90
    }

    if(!isValidCoord(Number(latitude)) || !isValidCoord(Number(longitude))){
        res.status(400).send('Invalid coordinates')
        return
    }

    if(!availableNetworks.includes(network.toUpperCase())){
        res.status(400).send('Invalid network')
        return
    }

    const cajeros = cajeroService.cajerosCercanos(latitude, longitude, network)
    const response = cajeros.map(atm => ({
        banco: atm.banco, 
        direccion: atm.ubicacion,
        latitude: atm.lat,
        longitude: atm.long
    }))
    
    res.json({
        response
    })
}

exports.redes = async (req, res = response) => {
    const response = JSON.stringify(availableNetworks)
    res.json({
        response
    })
}