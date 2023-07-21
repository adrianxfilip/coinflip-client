import React, { useState } from "react";
import "../Styles/ControlPanel.scss";
import heads from "../Assets/heads.png";
import tails from "../Assets/tails.png";
import coinstack from "../Assets/coin-stack.png";

export default function ControlPanel() {
  const [betAmount, setAmount] = useState(0);

  const [selectedSide, setSide] = useState("");

  return (
    <div className="control-panel-container">
      <div className="side-pick-container">
        <h1 className="logo">COINFLIP</h1>
        <div className="side-pick-wrapper">
          <p>Side:</p>
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
      </div>
      <div className="bet-amount-container">
        <div className="amount-wrapper">
          <img src={coinstack} alt="Stack of coins" />
          <input
            className="amount-input"
            type="number"
            step="0.5"
            min="0"
            value={betAmount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setAmount(0);
              }
            }}
          ></input>
        </div>
        <div className="controls-wrapper">
          <button>CLEAR</button>
          <button>+0.5</button>
          <button>+1</button>
          <button>+10</button>
          <button>+100</button>
          <button>1/2</button>
          <button>X2</button>
          <button>MAX</button>
        </div>
        <button className="submit-bet">CREATE GAME</button>
      </div>
    </div>
  );
}
