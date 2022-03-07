import { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'

function FormComponent({showMap, 
                        setAtm, 
                        setAtmsWereFound, 
                        setNoAtmsWereFound, 
                        setLatitude,
                        currentLatitude,
                        setLongitude,
                        currentLongitude}) {
  // const [atm, setAtm] = useState({})
  const [currentNetwork, setNetwork] = useState(null)
  const [networkOptions, setNetworkOptions] = useState(null)
  // const [currentLatitude, setLatitude] = useState(null)
  // const [currentLongitude, setLongitude] = useState(null) 
  const [invalidLatitude, setInvalidLatitude] = useState(false) //
  const [invalidLongitude, setInvalidLongitude] = useState(false) //
  const [invalidNet, setInvalidNet] = useState(false) //

  useEffect( () => {
    axios.get('http://localhost:5000/api/cajeros/redes')
      .then(res => {
        const options = JSON.parse(res.data.response)
        setNetworkOptions(options)
        setNetwork(options[0])
      }).catch(err => {
        console.log(err)
      })
    
    getLocation()
  },[])

  const getLocation = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var coords = pos.coords;

      console.log('Your current position is:');
      console.log(`Latitude : ${coords.latitude}`);
      console.log(`Longitude: ${coords.longitude}`);
      console.log(`More or less ${coords.accuracy} meters.`);
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
      document.getElementById('latitude').value = coords.latitude
      document.getElementById('longitude').value = coords.longitude
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  const getAtms = (event) => {
    if(event){
      event.preventDefault()
    }

    console.log('latitud ' + currentLatitude)
    console.log('longitud ' + currentLongitude)

    if(invalidLatitude || invalidLongitude || invalidNet) {
      return false
    }

    if(currentLatitude == '-'){
      setInvalidLatitude(true)
      setLatitude(0)
      console.log('invalid input')
      return false
    }
    if(currentLongitude == '-'){
      setInvalidLongitude(true)
      setLongitude(0)
      return false
    }

    const coord = `${currentLatitude}, ${currentLongitude}`
    const network = `${currentNetwork}`

    axios.post('http://localhost:5000/api/cajeros', { coord, network })
      .then(res => {
        setAtm(res.data.response)
        showMap(true)
        if(res.data.response.length > 0) {
          setNoAtmsWereFound(false)
          setAtmsWereFound(true)
        }else {
          setAtmsWereFound(false)
          setNoAtmsWereFound(true)
        }
      }).catch(err => {
        console.log(err)
      })
  }


  const isValidCoord = (num) => {
    return isFinite(num) && Math.abs(num) <= 90
  }

  const handleLatitude = (event) => {
    const input = event.target.value
    if(input == '') {
      setLatitude(null)
      setInvalidLatitude(true)
      return
    }
    else if(input == '-') {
      setLatitude(null)
      return
    } 
    else if(isNaN(input)){
      event.target.value = currentLatitude
      return
    }else if(!isValidCoord(input)){
      event.target.value = currentLatitude
      return
    }
    setInvalidLatitude(false)
    setLatitude(Number(input))
  }

  const handleLongitude = (event) => {
    const input = event.target.value
    console.log(input)
    if(input == '') {
      setLongitude(null)
      setInvalidLongitude(true)
      return
    }
    if(input == '-') {
      setLongitude(null)
      return
    } 
    else if(isNaN(input)){
      event.target.value = currentLongitude
      return
    }else if(!isValidCoord(input)){
      event.target.value = currentLongitude
      return
    }
    setInvalidLongitude(false)
    setLongitude(Number(input))
  }

  const handleSelect = (event) => {
    const input = event.target.value
    if(!input || input === ''){
      console.log('invalid network')
      invalidNet(true)
      return
    }
    setInvalidNet(false)
    setNetwork(input)
  }

  return(
    <form onSubmit={getAtms} className="form">
      <Row>
        <Col>
          <Row>
            <label>
              Latitud
            </label>
          </Row>
          
            <input type="textbox"
              step="any"
              id="latitude"
              onChange={handleLatitude}
              placeholder="Ingrese su latitud" />
          
          {invalidLatitude &&
          <div className='error-msg'>
            Latitud Invalida
          </div>
          }
        </Col>
        <Col>
          <Row>
            <label>
              Longitud
            </label>
          </Row>
          
            <input type="textbox"
              step="0.1"
              id="longitude"
              onChange={handleLongitude}
              placeholder="Ingrese su longitud" />
          
          {invalidLongitude &&
          <div className='error-msg'>
            Longitud Invalida
          </div>
          }
        </Col>
        <Col>
          <Row>
            Red de Cajero
          </Row>
          <Row>
            <select onChange={handleSelect}>
              {networkOptions && networkOptions.map((n, index) =>
                <option key={index} value={n}>{n}</option> 
              )}
            </select>
          </Row>
          {invalidNet &&
          <div className='error-msg'>
            Error
          </div>
          }
        </Col>
        <div className="col submit-align">
            <input type="submit"
                    value="Buscar cajeros" 
                    className="submit-btn"/>
        </div>
      </Row>
    </form>
  )
}

export default FormComponent;