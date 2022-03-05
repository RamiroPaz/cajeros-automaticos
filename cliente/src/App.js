import './App.css'
import Maps from './components/Maps/Maps'
import AtmsInfo from './components/AtmsInfo/AtmsInfo'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [map, showMap] = useState(false)
  const [atm, setAtm] = useState({})
  const [atmsWereFound, setAtmsWereFound] = useState(false)
  const [noAtmsWereFound, setNoAtmsWereFound] = useState(false)
  const [currentNetwork, setNetwork] = useState(null)
  const [networkOptions, setNetworkOptions] = useState(null)
  const [currentLatitude, setLatitude] = useState(null)
  const [currentLongitude, setLongitude] = useState(null)
  const [invalidLatitude, setInvalidLatitude] = useState(false)
  const [invalidLongitude, setInvalidLongitude] = useState(false)
  const [invalidNet, setInvalidNet] = useState(false)


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

    console.log('latitud' + currentLatitude)
    console.log('long' + currentLongitude)


    if(currentLatitude == null || currentLatitude == '-'){
      setInvalidLatitude(true)
      setLatitude(0)
      console.log('invalid input')
      return false
    }
    if(currentLongitude == null || currentLongitude == '-'){
      setInvalidLongitude(true)
      setLongitude(0)
      return false
    }
    if(!currentNetwork){
      setInvalidNet(true)
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
      setLatitude(0)
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
      setLongitude(0)
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

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
          <FontAwesomeIcon icon={faMoneyBillWave}/>
            <span className='nav-title'>Buscar Cajeros</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
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
        <div className="map-section">
          <Row>
            <Col xl={9} lg={8} md={7} sm={12} className="map">
              {map &&
                <Maps atm={atm}
                  currentLatitude={currentLatitude}
                  currentLongitude={currentLongitude} />}
            </Col>
            <Col xl={3} lg={4} md={5} sm={12}>
              {atmsWereFound &&
              <div className='info-container'>
                <div className="atms-title">
                  <span className="available-atms">Cajeros Disponibles</span>
                </div>
                <AtmsInfo atm={atm} className="info-card-container"/>
              </div>}
              {noAtmsWereFound &&
              <div className='info-error-container'>
                <div className="atms-title">
                  <span className="unavailable-atm">No Hay Cajeros Disponibles</span>
                </div>
                <div className="info-card-container">
                  <p>Lo sentimos, no hay cajeros disponibles cerca de su posición</p>
                </div>
              </div>}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
