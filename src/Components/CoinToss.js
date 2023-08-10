import { useEffect } from "react";
import "../Styles/CoinToss.scss";
import ModelViewer from "./CoinModel";

export default function Coin({ winningSide }) {
  return (
    <div className="coin">
      <ModelViewer winningSide={winningSide}/>
    </div>
  );
}
