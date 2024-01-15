import React, { useEffect, useState, useRef } from "react";
import "../Styles/ControlPanel.scss";
import coinstack from "../Assets/coin-stack.png";
import { motion, useAnimation } from "framer-motion";
import ModelViewer from "./ControlPanelCoin";
import logo from "../Assets/logo.png";
import Chat from "./Chat";

export default function ControlPanel({ socket, userData, chatData }) {
  const [betData, setBetData] = useState({
    betAmount: 0,
    selectedSide: null,
  });

  const [mustSelectSide, setSelectSide] = useState(false);

  const [mustSelectAmount, setSelectAmount] = useState(false);

  const regex = /^([0-9]+(\.?[0-9]?[0-9]?)?$)/;

  const createRoom = () => {
    betData.selectedSide === null ? setSelectSide(true) : setSelectSide(false);
    betData.betAmount === 0 ? setSelectAmount(true) : setSelectAmount(false);
    if (
      betData.selectedSide != null &&
      betData.betAmount != 0 &&
      betData.betAmount <= userData.balance
    ) {
      socket.emit("create-room", betData, userData);
    }
  };

  const [showChat, setShowChat] = useState(false);

  const menuControls = useAnimation()

  const menuVariants = {
    menuOpen : {
      height : "260px"
    },
    menuClosed : {
       height: "35px"
    },
    chevronOpen : {
      d: "M10 20 L30 27 L50 20"
    },
    chevronClosed: {
      d: "M10 20 L30 13 L50 20"
    }
  }

  const [menuState, setMenuState] = useState("open")

  const handleMenu = () => {
    if(menuState === "open"){
      menuControls.start("menuClosed")
      menuControls.start("chevronClosed")
      setMenuState("closed")
    }
    if(menuState === "closed"){
      menuControls.start("menuOpen")
      menuControls.start("chevronOpen")
      setMenuState("open")
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  return (
    <motion.div className="control-panel-container" variants={menuVariants} animate={menuControls}>
      <svg width="60" height="40" onClick={handleMenu}>
        <motion.path
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          variants={menuVariants}
          initial="chevronOpen"
          animate={menuControls}
        />
      </svg>
      {/*<Chat
        socket={socket}
        username={userData.name}
        chatData={chatData}
        showChat={showChat}
        closeChat={() => {
          setShowChat(false);
        }}
      />*/}
      <>
        <div className="header">
          <img src={logo}></img>
          <div>
            {/*<i
              className="fi fi-rr-messages"
              onClick={() => {
                setShowChat(true);
              }}
            ></i>*/}
            <i className="fi fi-rr-expand" onClick={toggleFullScreen}></i>
          </div>
        </div>
        <motion.div className="control-panel-wrapper">
          <div className="side-pick-container">
            <ModelViewer side={betData.selectedSide} />
            <div className="side-pick-wrapper">
              <motion.button
                className={
                  mustSelectSide
                    ? "side-pick-button not-selected"
                    : "side-pick-button"
                }
                initial={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0% , #100d13 100% )",
                  color: "#ffba0d",
                  transition: {
                    duration: 0.1,
                  },
                }}
                animate={
                  betData.selectedSide === "heads"
                    ? {
                        backgroundImage:
                          "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100% )",
                        color: "#100d13",
                      }
                    : {}
                }
                whileHover={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100% )",
                  color: "#100d13",
                  transition: {
                    duration: 0.1,
                  },
                }}
                whileTap={{
                  scale: 0.85,
                }}
                onClick={() => {
                  setBetData({ ...betData, selectedSide: "heads" });
                  if (mustSelectSide) {
                    setSelectSide(false);
                  }
                }}
              >
                {window.TEXTS.heads}
              </motion.button>
              <motion.button
                className={
                  mustSelectSide
                    ? "side-pick-button not-selected"
                    : "side-pick-button"
                }
                initial={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                  color: "#ffba0d",
                  transition: {
                    duration: 0.1,
                  },
                }}
                animate={
                  betData.selectedSide === "tails"
                    ? {
                        backgroundImage:
                          "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100% )",
                        color: "#100d13",
                      }
                    : {}
                }
                whileHover={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                  color: "#100d13",
                  transition: {
                    duration: 0.1,
                  },
                }}
                whileTap={{
                  scale: 0.85,
                }}
                onClick={() => {
                  setBetData({ ...betData, selectedSide: "tails" });
                  if (mustSelectSide) {
                    setSelectSide(false);
                  }
                }}
              >
                {window.TEXTS.tails}
              </motion.button>
            </div>
            <div className="bet-amount-container">
              <p className="balance">
                {window.TEXTS.balance} :{" "}
                <span>
                  {userData.balance} {window.CURRENCY}
                </span>
              </p>
              <div
                className={
                  mustSelectAmount
                    ? "bet-amount-wrapper not-selected"
                    : "bet-amount-wrapper"
                }
              >
                <img src={coinstack} alt="Stack of coins" />
                <input
                  className="amount-input"
                  type="text"
                  min="0"
                  value={betData.betAmount}
                  onChange={(e) => {
                    if (regex.test(e.target.value) || e.target.value === "") {
                      setBetData({ ...betData, betAmount: e.target.value });
                      if (mustSelectAmount) {
                        setSelectAmount(false);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "" || e.target.value === "0") {
                      setBetData({ ...betData, betAmount: 0 });
                    } else {
                      setBetData({
                        ...betData,
                        betAmount: parseFloat(e.target.value).toFixed(2),
                      });
                    }
                  }}
                ></input>{" "}
                <button
                  onClick={() => {
                    setBetData({ ...betData, betAmount: 0 });
                  }}
                >
                  RESET
                </button>
              </div>
              <div className="controls-wrapper">
                <motion.button
                  initial={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                    color: "#ffba0d",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileHover={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                    color: "#100d13",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  onClick={() => {
                    setBetData({
                      ...betData,
                      betAmount: (parseFloat(betData.betAmount) + 0.5).toFixed(
                        2
                      ),
                    });
                  }}
                >
                  +0.5
                </motion.button>
                <motion.button
                  initial={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                    color: "#ffba0d",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileHover={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                    color: "#100d13",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  onClick={() => {
                    setBetData({
                      ...betData,
                      betAmount: (parseFloat(betData.betAmount) + 1).toFixed(2),
                    });
                  }}
                >
                  +1
                </motion.button>
                <motion.button
                  initial={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                    color: "#ffba0d",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileHover={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                    color: "#100d13",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  onClick={() => {
                    setBetData({
                      ...betData,
                      betAmount: (parseFloat(betData.betAmount) + 5).toFixed(2),
                    });
                  }}
                >
                  +5
                </motion.button>
                <motion.button
                  initial={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                    color: "#ffba0d",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileHover={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                    color: "#100d13",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  onClick={() => {
                    setBetData({
                      ...betData,
                      betAmount: (parseFloat(betData.betAmount) + 10).toFixed(
                        2
                      ),
                    });
                  }}
                >
                  +10
                </motion.button>
                <motion.button
                  initial={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #100d13 0%, #100d13 100.2% )",
                    color: "#ffba0d",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileHover={{
                    backgroundImage:
                      "radial-gradient( circle farthest-corner at 10% 20%,  #f9e833 0%, #fac43b 100.2% )",
                    color: "#100d13",
                    transition: {
                      duration: 0.1,
                    },
                  }}
                  whileTap={{
                    scale: 0.85,
                  }}
                  onClick={() => {
                    setBetData({ ...betData, betAmount: userData.balance });
                  }}
                >
                  MAX
                </motion.button>
              </div>
              <motion.button
                className="submit-bet"
                initial={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 52%,  #f9e833 0%, #fac43b 100.2% )",
                  transition: {
                    duration: 0.1,
                  },
                }}
                whileHover={{
                  backgroundImage:
                    "radial-gradient( circle farthest-corner at 10% 52%,  #f9e833 70%, #fac43b 100.2% )",
                  scale: 1.02,
                  transition: {
                    duration: 0.1,
                  },
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={createRoom}
              >
                {window.TEXTS.createGame}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </>
    </motion.div>
  );
}
