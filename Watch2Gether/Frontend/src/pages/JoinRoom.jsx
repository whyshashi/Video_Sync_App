import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../styles/JoinRoom.module.css';

const JoinRoom = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "https://video-sync-app.onrender.com/api/room/join",
        { roomId },
        config
      );
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  return (
    <div id={styles.popjoinroom}>
      <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      <div className={styles.joinroomcontainer}>
        <h4 className={styles.title}>Join Room</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={styles.textField}
            required
          />
          <button type="submit" className={styles.button}>
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
