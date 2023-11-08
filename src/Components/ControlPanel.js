import React, { useState } from "react";
import "../Styles/ControlPanel.scss";
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";
import coinstack from "../Assets/coin-stack.png";

export default function ControlPanel({ socket, userData}) {

  const [betInfo, setBetInfo] = useState({
    betAmount : 0,
    selectedSide : null
  })

  const [mustSelectSide, setSelectSide] = useState(false);

  const [mustSelectAmount, setSelectAmount] = useState(false);

  const regex = /^([0-9]+(\.?[0-9]?[0-9]?)?$)/;

  const createRoom = () => {
    betInfo.selectedSide ? setSelectSide(true) : setSelectSide(false);
    betInfo.betAmount > 0 ? setSelectAmount(true) : setSelectAmount(false);
    if (betInfo.selectedSide && betInfo.betAmount && betInfo.betAmount <= userData.balance) {
      socket.emit("create-room", { betInfo: betInfo, userData : userData });
    }
  };

  return (
    <div className="control-panel-container">
      <div className="balance-wrapper">
        <h1 className="logo">COINFLIP</h1>
        <p className="balance">{window.TEXTS.balance} <span>{userData.balance.toFixed(2)} RON</span></p>
      </div>
      <div className="bet-amount-container">
        <div
          className={
            mustSelectAmount ? "amount-wrapper not-selected" : "amount-wrapper"
          }
        >
          <div>
            <img src={coinstack} alt="Stack of coins" />
            <input
              className="amount-input"
              type="text"
              min="0"
              value={betInfo.betAmount}
              onChange={(e) => {
                if (regex.test(e.target.value) || e.target.value === "") {
                  setBetInfo({...betInfo, betAmount : e.target.value});
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "" || e.target.value === "0") {
                  setBetInfo({...betInfo, betAmount : 0});
                } else {
                  setBetInfo({...betInfo, betAmount : parseFloat(e.target.value).toFixed(2)});
                }
              }}
            ></input>{" "}
          </div>
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : 0});
            }}
          >
            RESET
          </button>
        </div>
        <div className="controls-wrapper">
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) + 0.5).toFixed(2)});
            }} 
          >
            +0.5
          </button>
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) + 1).toFixed(2)});
            }}
          >
            +1
          </button>
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) + 10).toFixed(2)});
            }}
          >
            +10
          </button>
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) + 100).toFixed(2)});
            }}
          >
            +100
          </button>
          <button
            className="half-btn"
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) / 2).toFixed(2)});
            }}
          >
            1/2
          </button>
          <button
            className="x2-btn"
            onClick={() => {
              setBetInfo({...betInfo, betAmount : (parseFloat(betInfo.betAmount) * 2).toFixed(2)});
            }}
          >
            X2
          </button>
          <button
            onClick={() => {
              setBetInfo({...betInfo, betAmount : userData.balance});
            }}
          >
            MAX
          </button>
        </div>
      </div>
      <div className="side-pick-container">
        <div
          className={
            mustSelectSide
              ? "side-pick-wrapper not-selected"
              : "side-pick-wrapper"
          }
        >
          <img
            src={heads}
            className={betInfo.selectedSide === "heads" ? "selected-side" : ""}
            alt="Heads part of coin"
            onClick={() => {
              setBetInfo({...betInfo, selectedSide : "heads"});
            }}
          />
          <img
            src={tails}
            className={betInfo.selectedSide === "tails" ? "selected-side" : ""}
            alt="Tails part of coin"
            onClick={() => {
              setBetInfo({...betInfo, selectedSide : "tails"});
            }}
          />
        </div>
        <button className="submit-bet" onClick={createRoom}>
          {window.TEXTS.createGame}
        </button>
      </div>
    </div>
  );
}
