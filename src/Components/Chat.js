import { useState, useEffect } from "react";
import "../Styles/Chat.scss";
import { motion } from "framer-motion";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export default function Chat({ socket, chat, clientsCount, username }) {
  const { height, width } = useWindowDimensions();

  const chatVariants = {
    open: {
      top: "0",
      bottom: "0",
      left: "0",
      backgroundColor: "#141419",
      transition: {
        type: "easeOut",
        duration: 0.2,
      },
    },
    closed: {
      top: "0",
      bottom: "0",
      left: "-30em",
      transition: {
        type: "easeOut",
        duration: 0.2,
      },
    },
  };

  const [isOpen, setOpen] = useState(false);

  const openMenu = () => {
    if (isOpen) {
      setOpen(!isOpen);
      document.body.style.overflow = "unset";
      document.body.style.height = "fit-content";
    }
    if (!isOpen) {
      setOpen(!isOpen);
      if (width < 550) {
        document.body.style.overflow = "hidden";
        document.body.style.height = "100vh";
      }
    }
  };

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if(message != ""){
      socket.emit("new-message", { name: username, message: message });
    }
  };

  return (
    <>
      <motion.div
        className="chat"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={chatVariants}
      >
        <div className="connected-users-wrapper">
          <p className="connected-users">
            Online <span>&bull;</span> {clientsCount}
          </p>
          <button onClick={openMenu} className="close-chat">
            <i className="fi fi-rr-cross-small" />
          </button>
        </div>
        <div className="chat-entries-wrapper">
          {chat.map((entry, index) => (
            <p className="chat-entry" key={"entry" + index}>
              <span>{entry.name}</span> {entry.message}
            </p>
          ))}
        </div>
        <form
          className="message-form"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage("");
            sendMessage();
          }}
        >
          <textarea
            spellCheck="false"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></textarea>
          <button className="send-message-btn" type="submit">
            <i className="fi fi-rr-paper-plane"></i>
          </button>
        </form>
      </motion.div>
      <button onClick={openMenu} className="open-chat">
        <i className="fi fi-rr-messages" />
      </button>
    </>
  );
}
