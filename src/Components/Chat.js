import { useEffect, useState } from "react";
import "../Styles/Chat.scss";
import { motion } from "framer-motion";
import { Profanity, ProfanityOptions} from '@2toad/profanity';

const options = new ProfanityOptions()
options.grawlix = "*****"
const profanity = new Profanity(options)
profanity.addWords(['pula', 'pizda'])


export default function Chat({ socket, chat, clientsCount, username }) {

  const [isChatRestricted, setRestricted] = useState(false)

  useEffect(()=> {
    const chatController = JSON.parse(localStorage.getItem("chatController"))
    const currentTime = Date.now()
    if(chatController){
      if(chatController.isChatRestricted){
        if(Math.floor(Math.abs(currentTime - chatController.restrictionTime) / (60* 60 * 1000)) < 1){
          setRestricted(true)
        }else{
          setRestricted(false)
          localStorage.setItem("chatController", JSON.stringify({isChatRestricted : false, restrictionTime: 0}))
        }
      }
    }
  }, [isChatRestricted])

  const [message, setMessage] = useState("");

  const sendMessage = (newMessage) => {
    if(newMessage !== ""){
      if (profanity.exists(newMessage)){
        setRestricted(true)
        localStorage.setItem("chatController", JSON.stringify({isChatRestricted : true, restrictionTime: Date.now()}))
      }else{
        socket.emit("new-message", { name: username, message: newMessage });
      }
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
          <input
           type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></input>
          <button className="send-message-btn" type="submit">
          <i className="fi fi-sr-paper-plane-top"></i>
          </button>
        </form>
      </motion.div>
  );
}
