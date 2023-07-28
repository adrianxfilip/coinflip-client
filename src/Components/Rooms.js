import { useEffect, useState } from "react"
import "../Styles/Rooms.scss"
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";

function RoomCard({roomID, betAmount, players}){
    return (
        <div className="room-card">
            <div className="player">
                <img src={players[roomID].side == heads ? heads : tails} className="player-side"/>
                <p className="player-name">Player 1</p>
                <p className="bet-amount">{betAmount}</p>
            </div>
            <div className="coin"></div>
            <div className="player"></div>
        </div>
    )
}

export default function Rooms({socket}){

    const [rooms, setRooms] = useState({})

    useEffect(()=>{
        socket.on("rooms", (rooms) => {
            setRooms(rooms)
        })
    }, [])

    return (
        <div className="rooms-container">
            <div className="controls-container">
            </div>
            <div className="rooms-wrapper">
                <button onClick={()=>{
                    console.log(rooms)
                }}></button>
                {Object.keys(rooms).map(key=> (
                    <RoomCard key={key} roomID={key} betAmount={rooms[key].betAmount} players={rooms[key].players}/>
                ))} 
            </div>
        </div>
    )
}