import { useEffect, useState } from "react";
import "../Styles/CoinToss.scss";
import ModelViewer from "./CoinModel";
import { motion, useAnimationControls } from "framer-motion";

export default function Coin({ winningSide, roomID }) {
  const [isShowingCoin, showCoin] = useState(false);

  const [counter, setCounter] = useState(3);

  useEffect(() => {
    counter > 0
      ? setTimeout(() => setCounter(counter - 1), 1000)
      : showCoin(true);
  }, [counter]);

  return isShowingCoin ? (
    <>
      {" "}
      <div className={isShowingCoin ? "blur-overlay" : ""}></div>
      <div className="coin">
        <ModelViewer winningSide={winningSide} roomID={roomID} />{" "}
      </div>
    </>
  ) : (
    <p className="vs">{counter}</p>
  );
}
