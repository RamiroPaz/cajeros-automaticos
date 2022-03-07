import { Map, Marker } from "pigeon-maps"
import './Maps.css'

function Maps({atm, currentLatitude, currentLongitude, atmClicked, setAtmClicked}) {
    const teal = `hsl(179, 57%, 34%)`
    const salmon = `hsl(15, 52%, 57%)`
    const yellow = `hsl(43, 89%, 68%)`

    const atmMarker =  atm.map((a, index) => 
        <Marker key={index} 
                width={50} 
                anchor={[Number(a.latitude), Number(a.longitude)]} 
                color={index == atmClicked ? yellow :  salmon}
                className="atm-marker"
                onClick={() => setAtmClicked(index)}/>
    )

    return (
        <Map defaultCenter={[currentLatitude, currentLongitude]} defaultZoom={15}>
            <Marker className="icon" width={60} anchor={[currentLatitude, currentLongitude]} color={teal}/>
            {atmMarker}
        </Map>
    )
}

export default Maps