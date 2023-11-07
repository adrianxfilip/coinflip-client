import "./App.scss";
import { useEffect, useState } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
import Chat from "./Components/Chat";

const socket = socketIO.connect(window.SERVER_URL);

function App() {
  /*useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.origin === window.IFRAME_ORIGIN) {
        //setBalance(e.data.balance)
        setUserData({name:e.data.name, id : ""})
      }
    });
  }, []);*/

  const [balance, setBalance] = useState(250.0); // BALANCE TO BE SET BY MASTER CLIENT;

  const [userData, setUserData] = useState({ name: "User", id: "" });

  const [socketID, setSocketID] = useState("");

  const [rooms, setRooms] = useState({});

  const [chat, setChat] = useState([]);

  const [clientsCount, setClientsCount] = useState(0);

  useEffect(() => {
    socket.on("connected", (rooms, chat, id) => {
      setSocketID(id);
      setRooms(rooms);
      setChat(chat);
    });
    socket.on("balanceUpdate", (winnings) => {
      //window.parent.postMessage({winnings : winnings}, window.IFRAME_ORIGIN)
      setBalance((prev) => prev + winnings);
    });
    socket.on(
      "rooms",
      (rooms) => {
        setRooms(rooms);
      },
      []
    );
    socket.on("chat-update", (chat) => {
      setChat(chat);
    });
    socket.on("clients-count-update", (clientsCount) => {
      setClientsCount(clientsCount);
    });
  }, []);

  return (
    <div className="App">
      {socketID ? (
        <>
          <Chat
            socket={socket}
            chat={chat}
            clientsCount={clientsCount}
            username={userData.name}
          />
          <div className="game-container">
            <ControlPanel
              socket={socket}
              balance={balance}
              userData={userData}
            />
            <Rooms
              socket={socket}
              preFilteredRooms={rooms}
              socketID={socketID}
              balance={balance}
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
