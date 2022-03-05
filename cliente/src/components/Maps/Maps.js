import { Map, Marker } from "pigeon-maps"
// import { useState } from 'react'
import './Maps.css'

function Maps({atm, currentLatitude, currentLongitude}) {
    const color = `hsl(96deg 86% 35%)`
    const color2 = `hsl(61deg 86% 35%)`
    
    // const [click, setClick] = useState(false)
    

    const atmClick = (index) => {
        console.log(atm[index])
        // tooltip(atm[index].banco)
        // setClick(!click)
    }

    // const tooltip = (info) => {
    //     <div className="info-popup">
    //         {info}
    //     </div>
    // }

    const atmMarker =  atm.map((a, index) => 
        <Marker key={index} 
                width={50} 
                anchor={[Number(a.latitude), Number(a.longitude)]} 
                color={color2}
                className="atm-marker"
                onClick={() => atmClick(index)}/>
    )

    return (
        <Map defaultCenter={[currentLatitude, currentLongitude]} defaultZoom={15}>
            <Marker className="icon" width={60} anchor={[currentLatitude, currentLongitude]} color={color}/>
            {atmMarker}
            {/* {click && tooltip()} */}
        </Map>
    )
}

export default Maps