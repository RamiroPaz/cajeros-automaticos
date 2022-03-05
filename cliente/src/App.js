import './App.css'
import Maps from './components/Maps/Maps'
import AtmsInfo from './components/AtmsInfo/AtmsInfo'
import { useState } from 'react'
import axios from 'axios'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [map, showMap] = useState(false)
  const [atm, setAtm] = useState({})
  const [atmsWereFound, setAtmsWereFound] = useState(false)
  const [currentNetwork, setNetwork] = useState('Banelco')
  const [currentLatitude, setLatitude] = useState(0)
  const [currentLongitude, setLongitude] = useState(0)

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

    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  const getAtms = (event) => {
    event.preventDefault()

    if(currentLatitude == 0 || currentLongitude == 0){
      return false
    }

    const coord = `${currentLatitude}, ${currentLongitude}`
    const network = `${currentNetwork}`

    axios.post('http://localhost:5000/api/cajeros', { coord, network })
      .then(res => {
        setAtm(res.data.response)
        showMap(true)
        if(res.data.response.length > 0) {
          setAtmsWereFound(true)
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
    if(input == '-') {return} 
    if(isNaN(input)){
      event.target.value = currentLatitude
      return
    }else if(!isValidCoord(input)){
      event.target.value = currentLatitude
      return
    }
    setLatitude(Number(input))
  }

  const handleLongitude = (event) => {
    const input = event.target.value
    if(input == '-') {return} 
    if(isNaN(input)){
      event.target.value = currentLongitude
      return
    }else if(!isValidCoord(input)){
      event.target.value = currentLongitude
      return
    }
    setLongitude(Number(input))
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
          <FontAwesomeIcon icon={faMoneyBillWave}/>
          Buscar Cajeros
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
                onChange={handleLatitude}
                placeholder="Ingrese su latitud" />
            </Col>
            <Col>
              <Row>
                <label>
                  Longitud
                </label>
              </Row>
              <input type="textbox"
                step="0.1"
                onChange={handleLongitude}
                placeholder="Ingrese su longitud" />
            </Col>
            <Col>
              Red de Cajero
            </Col>
            <div class="col submit-align">
                <input type="submit"
                       value="Obtener cajeros" 
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
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
