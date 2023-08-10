import React, { useEffect, useState } from "react";
import "../Styles/ControlPanel.scss";
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";
import coinstack from "../Assets/coin-stack.png";

export default function ControlPanel({ socket, balance }) {
  const [betAmount, setAmount] = useState(0);

  const [selectedSide, setSide] = useState("");

  const [mustSelectSide, setSelectSide] = useState(false);

  const [mustSelectAmount, setSelectAmount] = useState(false);

  const regex = /^([0-9]+(\.?[0-9]?[0-9]?)?$)/;

  const createRoom = () => {
    selectedSide === "" ? setSelectSide(true) : setSelectSide(false);
    betAmount == "" ? setSelectAmount(true) : setSelectAmount(false);
    if (selectedSide && betAmount && betAmount <= balance) {
      socket.emit("create-room", { betAmount: betAmount, side: selectedSide });
    }
  };

  return (
    <div className="control-panel-container">
      <div className="balance-wrapper">
        <h1 className="logo">COINFLIP</h1>
        <p className="balance">Balance <span>{balance.toFixed(2)} RON</span></p>
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
              value={betAmount}
              onChange={(e) => {
                if (regex.test(e.target.value) || e.target.value == "") {
                  setAmount(e.target.value);
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setAmount(0);
                } else {
                  setAmount(parseFloat(e.target.value));
                }
              }}
            ></input>{" "}
          </div>
          <button
            onClick={() => {
              setAmount(0);
            }}
          >
            RESET
          </button>
        </div>
        <div className="controls-wrapper">
          <button
            onClick={() => {
              setAmount(parseFloat(betAmount) + 0.5);
            }}
          >
            +0.5
          </button>
          <button
            onClick={() => {
              setAmount(parseFloat(betAmount) + 1);
            }}
          >
            +1
          </button>
          <button
            onClick={() => {
              setAmount(parseFloat(betAmount) + 10);
            }}
          >
            +10
          </button>
          <button
            onClick={() => {
              setAmount(parseFloat(betAmount) + 100);
            }}
          >
            +100
          </button>
          <button
            className="half-btn"
            onClick={() => {
              setAmount(
                parseInt(betAmount) === parseFloat(betAmount)
                  ? parseFloat(betAmount) / 2
                  : (parseFloat(betAmount) / 2).toFixed(2)
              );
            }}
          >
            1/2
          </button>
          <button
            className="x2-btn"
            onClick={() => {
              setAmount(parseFloat(betAmount) * 2);
            }}
          >
            X2
          </button>
          <button
            onClick={() => {
              setAmount(balance);
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
            className={selectedSide === "heads" ? "selected-side" : ""}
            alt="Heads part of coin"
            onClick={() => {
              setSide("heads");
            }}
          />
          <img
            src={tails}
            className={selectedSide === "tails" ? "selected-side" : ""}
            alt="Tails part of coin"
            onClick={() => {
              setSide("tails");
            }}
          />
        </div>
        <button className="submit-bet" onClick={createRoom}>
          Create Game
        </button>
      </div>
    </div>
  );
}
