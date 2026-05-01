import { useState } from "react";
import "../../../styles/LiveTimer.css";

const LiveTimer = ({ onClose }) => {
  // Пока статичное время для проверки верстки
  const timeLeft = 59 * 60 + 59; 

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="live-timer">
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-controls">
        <button onClick={onClose} className="close-btn">×</button>
      </div>
    </div>
  );
};

export default LiveTimer;