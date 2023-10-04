import "../Styles/CoinToss.scss";
import ModelViewer from "./CoinModel";

export default function Coin({ winningSide, roomID }) {
  return (
    <div className="coin">
      <ModelViewer winningSide={winningSide} roomID={roomID} />
    </div>
  );
}
