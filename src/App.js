import "./App.scss";
import { useState, useId, useReducer, useEffect } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
import Chat from "./Components/Chat";
import Header from "./Components/Header";

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
        connectedUsers: action.payload,
      };
    case "rooms-update":
      return {
        ...state,
        rooms: action.payload,
      };
    case "chat-update":
      return {
        ...state,
        chat: action.payload,
      };
  }
}

const names = [
  "Robert",
  "Kevin",
  "Jeke",
  "Mevin",
  "Keke",
  "Leke",
  "Bicu",
  "Robi",
  "Darius",
  "Shain",
  "Marius",
  "Dairos",
];

function App() {
  const id = useId();

  const [userData, setUserData] = useState({
    balance: null,
    name: "",
    playerID: "",
    socketID: "",
  });

  const [sessionData, dispatchSessionData] = useReducer(sessionDataReducer, {
    socketID: null,
    rooms: null,
    connectedUsers: null,
    chat: null,
  });

  useEffect(() => {
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
        balance: 2500.0,
        name: names[Math.floor(Math.random() * names.length)],
        playerID: id,
        socketID: socketID,
      });
    });

    socket.on("rooms-update", (rooms) => {
      console.log(rooms);
      dispatchSessionData({
        type: "rooms-update",
        payload: rooms,
      });
    });

    socket.on("balance-update", (amount) => {
      setUserData((prev) => ({
        ...prev,
        balance: prev.balance + amount,
      }));
    });

    socket.on("chat-update", (chat) => {
      dispatchSessionData({
        type: "chat-update",
        payload: chat,
      });
    });

    socket.on("connected-users-update", (connectedUsers) => {
      dispatchSessionData({
        type: "connected-users-update",
        payload: connectedUsers,
      });
    });
  }, []);

  return (
    <div className="App">
      {sessionData.socketID && sessionData.rooms ? (
        <>
          <div className="game-container">
            <ControlPanel
              socket={socket}
              userData={userData}
              chatData={{
                connectedUsers: sessionData.connectedUsers,
                chat: sessionData.chat,
              }}
            />
            <Rooms
              socket={socket}
              sessionData={sessionData}
              userData={userData}
            />
            <Chat socket={socket} username={userData.name} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
