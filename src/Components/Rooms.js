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

export default function Rooms({ socket, rooms, socketID }) {
  const [filterRange, setFilterRange] = useState("all");

  const [filterDisplay, setFilterDisplayed] = useState("All");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = window.FILTERS;

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  return (
    <div className="rooms-container">
      <div className="filters-container">
        <div className="open-games">
          <p>Open Games</p>{" "}
          <p>
            {
              Object.keys(rooms).filter((key) => rooms[key].status != "closed")
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
                  setFilterDisplayed(range[1] == 999999 ? range[0] + `+ ${window.CURRENCY}` : range[0] + " - " + range[1] + ` ${window.CURRENCY}`);
                  setIsFilterOpen(!isFilterOpen);
                }}
              >
                {range[1] == 999999 ? range[0] + `+ ${window.CURRENCY}` : range[0] + " - " + range[1] + ` ${window.CURRENCY}`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rooms-wrapper">
        {filterRange != "all"
          ? Object.keys(rooms)
              .filter(
                (key) =>
                  (rooms[key].bet >= filterRange[0] &&
                    rooms[key].bet < filterRange[1]) ||
                  rooms[key].status == "closed"
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
              />
            ))}
      </div>
    </div>
  );
}
