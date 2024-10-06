import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "../styles/Chat.module.css";

const socket = io("http://localhost:8000/", {
  transports: ["websocket"],
});

const Chat = ({ roomId, user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null); 

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("message", (msg) => {
      console.log(msg); 
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom(); 
  }, [messages]); 

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", { roomId, user, message });
      setMessage(""); 
    }
  };

  return (
    <div id={styles.popchat}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {messages.map((msg, index) => (
            <li key={index} className={styles.listItem}>
              <strong>{msg.user}: </strong> {msg.message}
            </li>
          ))}
          <div ref={chatEndRef} /> 
        </ul>
        <input
          className={styles.textField}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className={styles.button}>
          Send
        </button>
        <p></p>
      </div>
    </div>
  );
};

export default Chat;
