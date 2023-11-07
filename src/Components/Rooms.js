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
  balance,
  userData
}) {
  
  const joinRoom = () => {
    if(balance >= betAmount){
      socket.emit("join-room", {roomID : roomID, userData : userData});
    }
  };

  return (
    <div className="room-card">
      {status !== "closed" ? (
        <>
          <div className="player">
            <img
              src={playerOne.side === "heads" ? heads : tails}
              className="player-side"
              alt="Coin"
            />
            <p className="player-name">{playerOne.name}</p>
            <div className="bet-amount">
              <img src={coinstack} alt="Coin stack" />
              <p>{betAmount}</p>
            </div>
          </div>
          <div className="countdown">
            {status !== "ongoing" ? (
              <p className="vs">VS</p>
            ) : (
              <Coin winningSide={winningSide} roomID={roomID} />
            )}
          </div>
          <div className="player">
            <img
              src={playerOne.side === "heads" ? tails : heads}
              className="player-side"
              alt="Coin"
            />
            {playerTwo.id === "" ? (
              playerOne.id === socketID ? (
                <div className="dot-stretching"></div>
              ) : (
                <>
                  <button className="join-room" onClick={joinRoom}>
                    Join Game
                  </button>
                </>
              )
            ) : (
              <p className="player-name">{playerTwo.name}</p>
            )}
            <div className="bet-amount">
              <img src={coinstack} alt="Coin Stack"/>
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

export default function Rooms({ socket, preFilteredRooms, socketID, balance, userData }) {

  const [filterRange, setFilterRange] = useState("all");

  const [filterDisplay, setFilterDisplayed] = useState("All");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = window.FILTERS;

  const [rooms, setRooms] = useState(preFilteredRooms)

  useEffect(()=>{
    var index = Object.keys(preFilteredRooms).findLastIndex((key)=> preFilteredRooms[key].status !== "closed")
    if(index <= 4){
      index = 5
    }else{
      index=index+1
    }
    var result = Object.keys(preFilteredRooms).slice(0, index).reduce((result, key)=>{
      result[key] = preFilteredRooms[key]
      return result
    }, {})
    setRooms(result)
  },[preFilteredRooms])

  return (
    <div className="rooms-container">
      <div className="filters-container">
        <div className="open-games">
          <p>{window.TEXTS.openGames}</p>{" "}
          <p>
            {
              Object.keys(rooms).filter((key) => rooms[key].status !== "closed")
                .length
            }
          </p>
        </div>
        <div className="filters-wrapper">
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
            }}
          >
            <i className="fi fi-rr-settings-sliders"></i>
            {filterDisplay}
          </button>
          <div
            className="filter-options-popup"
            style={{ display: isFilterOpen ? "block" : "none" }}
          >
            <button
              onClick={() => {
                setFilterRange("all");
                setFilterDisplayed("All");
                setIsFilterOpen(!isFilterOpen);
              }}
            >
              All
            </button>
            {filterOptions.map((range, index) => (
              <button
                key={"filterOption" + index}
                onClick={() => {
                  setFilterRange(range);
                  setFilterDisplayed(range[1] === 999999 ? range[0] + `+ ${window.CURRENCY}` : range[0] + " - " + range[1] + ` ${window.CURRENCY}`);
                  setIsFilterOpen(!isFilterOpen);
                }}
              >
                {range[1] === 999999 ? range[0] + `+ ${window.CURRENCY}` : range[0] + " - " + range[1] + ` ${window.CURRENCY}`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rooms-wrapper">
        {filterRange !== "all"
          ? Object.keys(rooms)
              .filter(
                (key) =>
                  (rooms[key].bet >= filterRange[0] &&
                    rooms[key].bet < filterRange[1]) ||
                  rooms[key].status === "closed"
              )
              .map((key) => (
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
                  balance={balance}
                  userData={userData}
                />
              ))
          : Object.keys(rooms).map((key) => (
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
                balance={balance}
                userData={userData}
              />
            ))}
      </div>
    </div>
  );
}
