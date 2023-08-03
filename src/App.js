import "./App.css"
import { useEffect, useState } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://buratancunebunu.home.ro:4000");

function App() {

  const [balance, setBalance] = useState(250) // BALANCE TO BE SET BY MASTER CLIENT;

  const [socketID, setSocketID] = useState("");

  const [rooms, setRooms] = useState({})

  useEffect(()=>{
    socket.on("connected", (rooms, id) => {
      setSocketID(id);
      setRooms(rooms)
    });
  }, [])

  return (
    <div className="App">
      {socketID ? (
        <>
          <ControlPanel socket={socket} balance={balance} />
          <Rooms socket={socket} initialRooms={rooms} socketID={socketID}/>
        </>
      ) : (
        <h1 style={{textAlign :"center", color: "white"}}>LOADING</h1>
      )}
    </div>
  );
}

export default App;
