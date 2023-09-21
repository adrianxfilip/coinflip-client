import "./App.css";
import { useEffect, useState } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
import Chat from "./Components/Chat";

// HOME
//const socket = socketIO.connect("http://buratancunebunu.home.ro:4000");

// ANDREEA
const socket = socketIO.connect("http://192.168.1.174:4000");

function App() {
  const [balance, setBalance] = useState(250.00); // BALANCE TO BE SET BY MASTER CLIENT;

  const [userData, setUserData] = useState({name : "TBD", id : ""})

  const [socketID, setSocketID] = useState("");

  const [rooms, setRooms] = useState({});

  const [chat, setChat] = useState([])

  const [clientsCount, setClientsCount] = useState(0)

  useEffect(()=>{
    socket.on("connected", (rooms, chat, id) => {
      setSocketID(id);
      setRooms(rooms);
      setChat(chat);
    });
    socket.on("balanceUpdate", (newBalance) => {
      setBalance((prev)=>prev + newBalance);
    });
    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    }, []);
    socket.on("chat-update", (chat) => {
      setChat(chat);
    });
    socket.on("clients-count-update", (clientsCount) => {
      setClientsCount(clientsCount)
    })
  }, [])


  return (
    <div className="App">
      {socketID ? (
        <>
          <ControlPanel socket={socket} balance={balance} />
          <Rooms socket={socket} rooms={rooms} socketID={socketID}/>
          <Chat socket={socket} chat={chat} clientsCount={clientsCount} username={userData.name} />
        </>
      ) : (
        <h1 style={{ textAlign: "center", color: "white" }}>LOADING</h1>
      )}
    </div>
  );
}

export default App;
