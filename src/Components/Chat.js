import { useState, useEffect } from "react";
import "../Styles/Chat.scss";
import { motion } from "framer-motion";
import { Profanity, ProfanityOptions} from '@2toad/profanity';

const options = new ProfanityOptions()
options.grawlix = "*****"
const profanity = new Profanity(options)
profanity.addWords(['pula', 'pizda'])


export default function Chat({ socket, chat, clientsCount, username }) {

  const [message, setMessage] = useState("");

  const sendMessage = (newMessage) => {
    if(newMessage !== ""){
      if (profanity.exists(newMessage)){
        newMessage = profanity.censor(newMessage)
      }
      socket.emit("new-message", { name: username, message: newMessage });
    }
  };

  return (
      <motion.div
        className="chat"
      >
        <div className="connected-users-wrapper">
          <p>Chat</p>
          <p>
          <i className="fi fi-br-users"></i> {clientsCount}
          </p>
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
            sendMessage(message);
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
  );
}
