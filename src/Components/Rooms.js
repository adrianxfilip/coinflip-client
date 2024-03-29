import { useState, useEffect } from "react";
import "../Styles/Rooms.scss";
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";
import coinstack from "../Assets/coin-stack.png";
import Coin from "./CoinToss";
import {motion, useAnimationControls} from "framer-motion"

function RoomCard({ roomData, socketID, socket, userData }) {

  const joinRoom = () => {
    if (userData.balance >= roomData.bet) {
      socket.emit("join-room", roomData.roomID, userData);
    }
  };

  const player1Controls = useAnimationControls()
  const player2Controls = useAnimationControls()

  useEffect(() => {
    setTimeout(()=>{
      if(roomData.winningSide == roomData.playerTwo.side && roomData.winningSide != ""){
        player1Controls.start({
          filter : "saturate(20%)",
          backgroundColor : "#100d1300",
          boxShadow:"none",
          transition: {
            duration : 0.2
          }
        })
      }
      if(roomData.winningSide == roomData.playerOne.side && roomData.winningSide != ""){
        player2Controls.start({
          filter : "saturate(20%)",
          backgroundColor : "#100d1300",
          boxShadow:"none",
          transition: {
            duration : 0.2
          }
        })
      }
    }, 5500)
  }, [roomData.winningSide])

  return (
    <div className="room-card">
      {roomData.status !== "closed" ? (
        <>
          <motion.div animate={player1Controls} className="player">
            <img
              src={roomData.playerOne.side === "heads" ? heads : tails}
              className="player-side"
              alt="Coin"
            />
            <p className="player-name">{roomData.playerOne.name}</p>
            <div className="bet-amount">
              <img src={coinstack} alt="Coin stack" />
              <p>{roomData.bet}</p>
            </div>
          </motion.div>
          <div className="countdown">
            {roomData.status !== "ongoing" ? (
              <p className="vs">VS</p>
            ) : (
              <Coin
                winningSide={roomData.winningSide}
                roomID={roomData.roomID}
              />
            )}
          </div>
          <motion.div animate={player2Controls} className="player">
            <img
              src={roomData.playerOne.side === "heads" ? tails : heads}
              className="player-side"
              alt="Coin"
            />
            {roomData.playerTwo.socketID === "" ? (
              roomData.playerOne.socketID === socketID ? (
                <div className="dot-stretching"></div>
              ) : (
                <>
                  <button className="join-room" onClick={joinRoom}>
                    {window.TEXTS.joinGame}
                  </button>
                </>
              )
            ) : (
              <p className="player-name">{roomData.playerTwo.name}</p>
            )}
            <div className="bet-amount">
              <img src={coinstack} alt="Coin Stack" />
              <p>{roomData.bet}</p>
            </div>
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function Rooms({ socket, sessionData, userData }) {
  const [filterSettings, setFilterSettings] = useState({
    filterRanges: window.FILTERS,
    activeRange: [0,99999],
    filterDisplay: "All",
    isOpen: false,
  });

  const [roomsLimit, setRoomsLimit] = useState(5);

  useEffect(() => {
    var index = Object.keys(sessionData.rooms).findLastIndex(
      (key) => sessionData.rooms[key].status !== "closed"
    );
    if (index > 5) {
      setRoomsLimit(index);
    } else {
      setRoomsLimit(10);
    }
  }, [sessionData.rooms]);

  return (
    <div className="rooms-container">
      <div className="filters-container">
        <div className="open-games">
          <p>{window.TEXTS.openGames}</p>{" "}
          <p>
            {
              Object.keys(sessionData.rooms).filter(
                (key) => sessionData.rooms[key].status !== "closed"
              ).length
            }
          </p>
        </div>
        <div className="filters-wrapper">
          <button
            onClick={() => {
              setFilterSettings({
                ...filterSettings,
                isOpen: !filterSettings.isOpen,
              });
            }}
          >
            <i className="fi fi-rr-settings-sliders"></i>
            {filterSettings.filterDisplay}
          </button>
          <div
            className="filter-options-popup"
            style={{ display: filterSettings.isOpen ? "block" : "none" }}
          >
            <button
              onClick={() => {
                setFilterSettings({
                  ...filterSettings,
                  activeRange: [0,99999],
                  filterDisplay: "All",
                  isOpen: !filterSettings.isOpen,
                });
              }}
            >
              All
            </button>
            {filterSettings.filterRanges.map((range, index) => (
              <button
                key={"filterOption" + index}
                onClick={() => {
                  setFilterSettings({
                    ...filterSettings,
                    activeRange: range,
                    filterDisplay:
                      range[1] === 999999
                        ? range[0] + `+ ${window.CURRENCY}`
                        : range[0] + " - " + range[1] + ` ${window.CURRENCY}`,
                    isOpen: !filterSettings.isOpen,
                  });
                }}
              >
                {range[1] === 999999
                  ? range[0] + `+ ${window.CURRENCY}`
                  : range[0] + " - " + range[1] + ` ${window.CURRENCY}`}
              </button>
            ))}
          </div>
        </div>
      </div>
      {sessionData.rooms ? (
        <div className="rooms-wrapper">
          {Object.keys(sessionData.rooms)
            .filter(
              (key) =>
                (sessionData.rooms[key].bet >= filterSettings.activeRange[0] &&
                  sessionData.rooms[key].bet < filterSettings.activeRange[1]) ||
                sessionData.rooms[key].status === "closed"
            )
            .map((key, index) =>
              index < roomsLimit ? (
                <RoomCard
                  key={key}
                  roomData={{ roomID: key, ...sessionData.rooms[key] }}
                  socketID={sessionData.socketID}
                  socket={socket}
                  userData={userData}
                />
              ) : (
                <></>
              )
            )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
