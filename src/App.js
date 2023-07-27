import ControlPanel from "./Components/ControlPanel";
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://buratancunebunu.home.ro:4000');

function App() {
  return (
    <div className="App">
      <ControlPanel socket={socket}/>
    </div>
  );
}

export default App;
