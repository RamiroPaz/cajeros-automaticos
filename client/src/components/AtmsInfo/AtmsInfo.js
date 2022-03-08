import './AtmsInfo.css'

function AtmsInfo({atm, atmClicked, setAtmClicked}) {

    return (
        atm.map((a, index )=> 
            <div key={index} className={index == atmClicked ? "info-card-click" : "info-card"} onClick={() => setAtmClicked(index)}>
                <div>
                    <span className="property">Banco:</span>
                    <span className="value"> {a.banco} </span>
                </div>
                <div>
                    <span className="property">Direccion:</span>
                    <span className="value"> {a.direccion}</span>
                </div>
                <div>
                    <span className="property">Latitud:</span>
                    <span className="value"> {a.latitude} </span>
                </div>
                <div>
                    <span className="property">Longitud:</span>
                    <span className="value"> {a.longitude}</span>
                </div>
            </div>
        )
    )
}

export default AtmsInfo