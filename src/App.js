import "./App.scss";
import { useState, useId, useReducer, useEffect } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
import Chat from "./Components/Chat";

const socket = socketIO.connect(window.SERVER_URL);

function sessionDataReducer(state, action) {
  switch (action.type) {
    default:
      return state;
    case "connected":
      return { ...action.payload };
    case "connected-users-update":
      return {
        ...state,
        connectedUsers : action.payload
      };
    case "rooms-update":
      return {
        ...state,
        rooms : action.payload
      };
    case "chat-update":
      return {
        ...state,
        chat : action.payload
      }
  }
}

function App() {

  const id = useId();

  const [userData, setUserData] = useState({
    balance: null,
    name: "",
    playerID: "",
    socketID: ""
  });

  const [sessionData, dispatchSessionData] = useReducer(sessionDataReducer, {
    socketID: null,
    rooms: null,
    connectedUsers: null,
    chat: null,
  });

  useEffect(()=>{
    socket.on("connected", (rooms, chat, connectedUsers, socketID) => {
      dispatchSessionData({
        type: "connected",
        payload: {
          socketID: socketID,
          rooms: rooms,
          connectedUsers: connectedUsers,
          chat: chat,
        },
      });
      setUserData({
        balance: 250.0,
        name: "User",
        playerID: id,
        socketID: socketID
      });
    });
  
    socket.on("balance-update", (amount) => {
      console.log(amount)
      setUserData((prev) => ({
        ...prev,
        balance : prev.balance + amount
      }));
    });
  
    socket.on("rooms-update", (rooms) => {
      console.log(rooms)
      dispatchSessionData({
        type: "rooms-update",
        payload: rooms,
      });
    });
  
    socket.on("chat-update", (chat) => {
      dispatchSessionData({
        type: "chat-update",
        payload: chat,
      });
    });
  
    socket.on("connected-users-update", (connectedUsers) => {
      console.log("update")
      dispatchSessionData({
        type: "connected-users-update",
        payload: connectedUsers,
      });
    });
  }, [])

  return (
    <div className="App">
      {sessionData.socketID && sessionData.rooms ? (
        <>
          <Chat
            socket={socket}
            chatData={{
              connectedUsers: sessionData.connectedUsers,
              chat: sessionData.chat,
            }}
            username={userData.name}
          />
          <div className="game-container">
            <ControlPanel socket={socket} userData={userData} />
            <Rooms
              socket={socket}
              sessionData={sessionData}
              userData={userData}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
