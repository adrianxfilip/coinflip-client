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

export default function Chat({socket, initialChat, clientsCount}) {
  const { height, width } = useWindowDimensions();

  const [chat, setChat] = useState(initialChat)

  const chatVariants = {
    open: {
      top: "0",
      bottom : "0",
      left: "0",
      backgroundColor: "#141419",
      transition: {
        type: "easeOut",
        duration: .2,
      },
    },
    closed: {
      top: "0",
      bottom :"0",
      left: "-30em",
      transition: {
        type: "easeOut",
        duration: .2,
      },
    },
  };

  const buttonVariants = {
    open: {
      padding: "0",
      bottom: width < 550 ? "94%" : "93%",
      left: width < 550 ? "90%" : "21em",
      transition: {
        type: "easeOut",
        duration: .2,
      },
    },
    closed: {
      padding: "1.3em",
      bottom: width < 550 ? "2%" : "2%",
      left: width < 550 ? "4px" : "15px",
      transition: {
        type: "easeOut",
        duration: .2,
      },
    },
  };

  const [isOpen, setOpen] = useState(false);

  const openMenu = () => {
    if(isOpen){
      setOpen(!isOpen)
      document.body.style.overflow = 'unset';
    }
    if(!isOpen){
      setOpen(!isOpen)
      if(width < 550){document.body.style.overflow = 'hidden';}
    }
  }

  return (
    <>
      <button onClick={()=>{console.log(chat)}}>LOG</button>
      <motion.div
        className="chat"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={chatVariants}
      >
        <p className="connected-users">Online <span>&bull;</span> {clientsCount}</p>
        <div className="chat-entries-wrapper">
        {chat.map((entry, index) => (
          <p className="chat-entry" key={"entry"+index}><span>{entry.name}</span> {entry.message}</p>
        ))}
        </div>
        <form className="message-form">
          <textarea spellCheck="false"></textarea>
          <button><i className="fi fi-rr-paper-plane"></i></button>
        </form>
      </motion.div>
      <motion.button
        onClick={openMenu}
        className= {isOpen ? "open-chat is-open" : "open-chat"}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={buttonVariants}
      >
        {isOpen ? (
          <i className="fi fi-rr-cross-small" />
        ) : (
          <i className="fi fi-rr-messages" />
        )}
      </motion.button>
    </>
  );
}
