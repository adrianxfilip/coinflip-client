import { useState } from "react";
import ControlPanel from "./Components/ControlPanel";
import Rooms from "./Components/Rooms";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://buratancunebunu.home.ro:4000");

function App() {

  const [balance, setBalance] = useState(250) // BALANCE TO BE SET BY MASTER CLIENT;

  const [isConnected, setConnected] = useState(false);

  socket.on("connected", () => {
    setConnected(true);
  });

  return (
    <div className="App">
      {isConnected ? (
        <>
          <ControlPanel socket={socket} balance={balance} />
          <Rooms socket={socket} />
        </>
      ) : (
        <h1 style={{textAlign :"center", color: "white"}}>LOADING</h1>
      )}
    </div>
  );
}

export default App;
