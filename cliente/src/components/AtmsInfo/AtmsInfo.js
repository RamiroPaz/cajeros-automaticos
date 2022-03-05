import './AtmsInfo.css'

function AtmsInfo({atm}) {

    // const atmItems = atm.map(a => 
    //     <div>
    //         <span>Banco: {a.banco}</span>
    //         <span>Direccion: {a.direccion}</span>
    //         <span>Latitude: {a.latitude}</span>
    //         <span>Longitude: {a.longitude}</span>
    //     </div>
    // )

    return (
        atm.map((a, index )=> 
            <div key={index} className="info-card">
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