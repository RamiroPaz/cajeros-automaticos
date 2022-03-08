import './App.css'
import FormComponent from './components/FormComponent/FormComponent'
import Maps from './components/Maps/Maps'
import AtmsInfo from './components/AtmsInfo/AtmsInfo'
import { useState } from 'react'
import { Container, Row, Col, Navbar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [map, showMap] = useState(false)
  const [atm, setAtm] = useState({})
  const [atmsWereFound, setAtmsWereFound] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [atmClicked, setAtmClicked] = useState(null)
  const [formData, setFormData] = useState({
    latitude: null,
    longitude: null
  })

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
          <FontAwesomeIcon icon={faMoneyBillWave}/>
            <span className='nav-title'>Buscar Cajeros</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <FormComponent showMap={showMap} 
                       setAtm={setAtm} 
                       setAtmsWereFound={setAtmsWereFound}
                       setHasStarted={setHasStarted}
                       setFormData={setFormData}
                       formData={formData}/>
        <div className="map-section">
          <Row>
            {map && 
            <Col xl={9} lg={8} md={7} sm={12} className="map">
              <Maps atm={atm}
                latitude={formData.latitude}
                longitude={formData.longitude}
                atmClicked={atmClicked}
                setAtmClicked={setAtmClicked} />
            </Col>}
            <Col xl={3} lg={4} md={5} sm={12}>
              {hasStarted && atmsWereFound &&
              <div className='info-container'>
                <div className="atms-title">
                  <span className="available-atms">Cajeros Disponibles</span>
                </div>
                <AtmsInfo atm={atm} 
                          atmClicked={atmClicked}
                          setAtmClicked={setAtmClicked}
                          className="info-card-container"/>
              </div>}
              {hasStarted && !atmsWereFound &&
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
