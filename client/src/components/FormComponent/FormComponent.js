import { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import ReCAPTCHA from "react-google-recaptcha";
import './FormComponent.css'

function FormComponent({showMap, 
                        setAtm, 
                        setAtmsWereFound, 
                        setHasStarted,
                        setFormData,
                        formData}) {

  const [currentNetwork, setNetwork] = useState(null)
  const [recaptcha, setRecaptcha] = useState(false)
  const [invalidRecaptcha, setInvalidRecaptcha] = useState(false)
  const [networkOptions, setNetworkOptions] = useState(null)
  const [invalid, setInvalid] = useState({
    latitude:false,
    longitude:false
  })
  const [invalidNet, setInvalidNet] = useState(false)

  useEffect( () => {
    // http request to get the available ATM networks
    axios.get('http://localhost:5000/api/cajeros/redes')
      .then(res => {
        const options = JSON.parse(res.data.response)
        setNetworkOptions(options)
        setNetwork(options[0])
      }).catch(err => {
        console.log(err)
      })
    // asks the user for permission to access their location
    getLocation()
  },[])

  const getLocation = () => {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      let coords = pos.coords;
      // setting the hooks and the form values
      setFormData({
        ...formData,
        latitude: coords.latitude,
        longitude: coords.longitude
      })
      document.getElementById('latitude').value = coords.latitude
      document.getElementById('longitude').value = coords.longitude
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  // http request to get the nearest atms
  const getAtms = (event) => {
    if(event){
      event.preventDefault()
    }

    // validations
    if(invalid.latitude || invalid.longitude || invalidNet) {
      return false
    }

    if(formData.latitude === null){
      setInvalid({
        ...invalid,
        latitude:true
      })
      return false
    }

    if(formData.longitude === null){
      setInvalid({
        ...invalid,
        longitude:true
      })
      return false
    }

    if(formData.latitude === '-'){
      setInvalid({
        ...invalid,
        latitude:true
      })
      setFormData({
        ...formData,
        latitude: 0
      })
      console.log(formData)
      return false
    }
    if(formData.longitude === '-'){
      setInvalid({
        ...invalid,
        longitude:true
      })
      setFormData({
        ...formData,
        longitude: 0
      })
      console.log(formData)
      return false
    }

    if(!recaptcha){
      setInvalidRecaptcha(true)
      return false
    }

    const latitude = formData.latitude
    const longitude = formData.longitude
    const network = currentNetwork

    axios.post('http://localhost:5000/api/cajeros', { latitude, longitude, network })
      .then(res => {
        setAtm(res.data.response)
        showMap(true)
        setHasStarted(true)
        if(res.data.response.length > 0) {
          setAtmsWereFound(true)
        }else {
          setAtmsWereFound(false)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  const isValidCoord = (num) => {
    return isFinite(num) && Math.abs(num) <= 90
  }

  // validates user input
  const handleCoord = (event) => {
    const { name, value } = event.target

    if(value === '') {
      setFormData({
        ...formData,
        [name]: null
      })
      setInvalid({
        ...invalid,
        [name]: true
      })
      return
    }
    // the minus character is valid but not a number
    else if(value === '-') {
      setFormData({
        ...formData,
        [name]: null
      })
      return
    }
    // prevents the user to write invalid characters
    else if(isNaN(value)){
      event.target.value = formData.latitude
      return
    }else if(!isValidCoord(value)){
      event.target.value = formData.latitude
      return
    }
    setInvalid({
      ...invalid,
      [name]: false
    })
    setFormData({
      ...formData,
      [name]: Number(value)
    })
  }

  // validates user input
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

  const handleCaptcha = (res) => {
    if(res) {
      setRecaptcha(true)
      setInvalidRecaptcha(false)
    }else{
      setRecaptcha(false)
    }
  }

  return(
    <form onSubmit={getAtms} className="form">
      <Row>
        <Col xl={2} lg={6} md={12}>
          <Row>
            <label>
              Latitud
            </label>
          </Row>
          
            <input type="textbox"
              step="any"
              id="latitude"
              name="latitude"
              onChange={handleCoord}
              placeholder="Ingrese su latitud" 
              className="input" />
          
          {invalid.latitude &&
          <div className='error-msg'>
            Latitud Invalida
          </div>
          }
        </Col>
        <Col xl={2} lg={6} md={12}>
          <Row>
            <label>
              Longitud
            </label>
          </Row>
          
            <input type="textbox"
              step="0.1"
              id="longitude"
              name="longitude"
              onChange={handleCoord}
              placeholder="Ingrese su longitud"
              className="input" />
          
          {invalid.longitude &&
          <div className='error-msg'>
            Longitud Invalida
          </div>
          }
        </Col>
        <Col xl={2} lg={6} md={12}>
          <Row>
            <label>
              Red de Cajero
            </label>
          </Row>
 
            <select onChange={handleSelect} className="input">
              {networkOptions && networkOptions.map((n, index) =>
                <option key={index} value={n}>{n}</option> 
              )}
            </select>

          {invalidNet &&
          <div className='error-msg'>
            Error
          </div>
          }
        </Col>
        <Col xl={3} lg={6} md={12}>
          <Row>
            <div className='recaptcha'>  
              <ReCAPTCHA
                sitekey="6Lei18AeAAAAAKIg9fnMFVS7wnVb5AI0TMVaHncn"
                onChange={handleCaptcha}
              />
            </div>
          </Row>
          {invalidRecaptcha &&
          <div className='error-msg recaptcha-error'>
            Completa el ReCAPTCHA
          </div>
          }
        </Col>
        <div className="col-xl-3 col-lg-12 col-md-12 submit-align">
            <input type="submit"
                    value="Buscar cajeros" 
                    className="submit-btn"/>
        </div>
      </Row>
    </form>
  )
}

export default FormComponent;