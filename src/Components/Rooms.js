import { useEffect, useState } from "react";
import "../Styles/Rooms.scss";
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";
import coinstack from "../Assets/coin-stack.png";
import Coin from "./CoinToss";

function RoomCard({
  roomID,
  betAmount,
  playerOne,
  playerTwo,
  status,
  winningSide,
  socketID,
  socket,
}) {
  const joinRoom = () => {
    socket.emit("join-room", roomID);
  };

  return (
    <div className="room-card">
      {status != "closed" ? (
        <>
          <div className="player">
            <img
              src={playerOne.side == "heads" ? heads : tails}
              className="player-side"
            />
            <p className="player-name">Player 1</p>
            <div className="bet-amount">
              <img src={coinstack} />
              <p>{betAmount}</p>
            </div>
          </div>
          <div className="countdown">
            {status != "ongoing" ? (
              <p className="vs">VS</p>
            ) : (
              <Coin winningSide={winningSide} />
            )}
          </div>
          <div className="player">
            <img
              src={playerOne.side == "heads" ? tails : heads}
              className="player-side"
            />
            {playerTwo.id == "" ? (
              playerOne.id == socketID ? (
                <div className="dot-stretching"></div>
              ) : (
                <>
                  <button className="join-room" onClick={joinRoom}>
                    Join Game
                  </button>
                </>
              )
            ) : (
              <p className="player-name">Player 2</p>
            )}
            <div className="bet-amount">
              <img src={coinstack} />
              <p>{betAmount}</p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function Rooms({ socket, initialRooms, socketID }) {
  const [rooms, setRooms] = useState(initialRooms);

  useEffect(() => {
    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    });
  }, []);

  return (
    <div className="rooms-container">
      <div className="controls-container">
        <div className="open-games">
          <p>Open Games</p>{" "}
          <p>
            {
              Object.keys(rooms).filter((key) => rooms[key].status != "closed")
                .length
            }
          </p>
        </div>
      </div>
      <div className="rooms-wrapper">
        {Object.keys(rooms).map((key) => (
          <RoomCard
            key={key}
            roomID={key}
            betAmount={rooms[key].bet}
            playerOne={rooms[key].playerOne}
            playerTwo={rooms[key].playerTwo}
            status={rooms[key].status}
            winningSide={rooms[key].winningSide}
            socketID={socketID}
            socket={socket}
          />
        ))}
      </div>
    </div>
  );
}
