import { Map, Marker } from "pigeon-maps"
import './Maps.css'

function Maps({atm, currentLatitude, currentLongitude}) {
    const color = `hsl(96deg 86% 35%)`
    const color2 = `hsl(61deg 86% 35%)`
    // const latitude = Number(atm.atm.latitude)
    // const longitude =  Number(atm.atm.long)

    const atmClick = (index) => console.log(index)

    const atmMarker =  atm.map((a, index) => 
        <Marker key={index} 
                width={50} 
                anchor={[Number(a.latitude), Number(a.longitude)]} 
                color={color2}
                onClick={() => atmClick(index)}/>
    )

    return (
        <Map defaultCenter={[currentLatitude, currentLongitude]} defaultZoom={15}>
            <Marker className="icon" width={60} anchor={[currentLatitude, currentLongitude]} color={color}/>
            {atmMarker}
        </Map>
    )
}

export default Maps