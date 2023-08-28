import { useState } from "react";
import "../Styles/Chat.scss";
import { motion } from "framer-motion";

export default function Chat() {
  const chat = {
    open: {
      height: "100vh",
      width: "400px",
      left: "0px",
      bottom: "0px",
      borderRadius: "0px",
      backgroundColor:"#1a1c24",
      transition: {
        type: "easeOut",
        duration: 0.2,

      },
    },
    closed: {
      height: "3em",
      width: "6em",
      left: "20px",
      bottom: "14px",
      borderRadius: "50px",
      transition: {
        type: "easeOut",
        duration: 0.2,
        borderRadius: {
          delay: 0.05,
        },
      },
    },
  };

  const [isOpen, setOpen] = useState(false);

  return (
    <motion.div
      className="chat"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={chat}
    >
      <button
        onClick={() => {
          setOpen(!isOpen);
        }}
        className={isOpen ? "open" : ""}
      >
        CHAT <i className="fi fi-br-messages"></i>
      </button>
    </motion.div>
  );
}
