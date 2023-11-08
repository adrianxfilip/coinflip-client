import "./App.scss";
import { useEffect, useState, useId } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
import Chat from "./Components/Chat";

const socket = socketIO.connect(window.SERVER_URL);

function App() {
  // TO BE REPLACED WITH GETTING ID FROM PARENT IFRAME
  //const id = useId();

  const [userData, setUserData] = useState({
    balance: null,
    name: "",
    id: "",
  });

  const [sessionData, setSessionData] = useState({
    socketID: null,
    rooms: null,
    connectedUsers: null,
    chat: null,
  });

  useEffect(() => {
    console.log(sessionData, userData);
  }, [sessionData]);

  socket.on("connected", (rooms, chat, connectedUsers, socketID) => {
    setSessionData({
      socketID: socketID,
      rooms: rooms,
      connectedUsers: connectedUsers,
      chat: chat,
    });
    setUserData({
      balance: 250.0,
      name: "User",
      id: socketID,
    });
  });

  socket.on("balance-update", (amount) => {
    setUserData((prev) => console.log(prev));
  });

  socket.on("balance-return", (amount) => {
    setUserData((prev) => console.log(prev));
  });

  socket.on("rooms-update", (rooms) => {
    setSessionData({ ...sessionData, rooms: rooms });
  });

  socket.on("chat-update", (chat) => {
    setSessionData({ ...sessionData, chat: chat });
  });

  socket.on("connected-users-update", (connectedUsers) => {
    //setSessionData({...sessionData, connectedUsers : connectedUsers})
  });

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
