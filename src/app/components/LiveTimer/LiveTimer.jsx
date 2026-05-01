import { useState, useEffect } from "react";
import "../../../styles/LiveTimer.css";

const LiveTimer = ({ onClose }) => {
    // Пока статичное время для проверки верстки
    //const timeLeft = 59 * 60 + 59; 

    const INITIAL_TIME = 10; // начальное время 10 сек для теста

    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [isRunning, setIsRunning] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Добавляем эффект для обратного отсчёта
    useEffect(() => {
        let intervalId;

        if (isRunning && !isFinished) {
            intervalId = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalId);
                        setIsFinished(true);
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Чистим интервал при размонтировании/изменении состояния
        return () => clearInterval(intervalId);
    }, [isRunning, isFinished]);

    // Закрываем таймер
    const handleClose = () => {
        if (onClose) onClose();
    };

    // Стоп/Возобновить
    const handleToggle = () => {
        if (!isFinished) {
            setIsRunning(prev => !prev);
        }
    };

    // Рестарт
    const handleRestart = () => {
        setTimeLeft(INITIAL_TIME);
        setIsFinished(false);
        setIsRunning(true);
    };

    // Показываем сообщение, если таймер завершен
    if (isFinished) {
        return (
            <div className="timer-finished">
                <span>Таймер истёк</span>
                <button onClick={handleRestart} className="restart-btn">Рестарт</button>
                <button onClick={handleClose} className="close-btn">×</button>
            </div>
        );
    }

    return (
        <div className="live-timer">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
                <button onClick={handleToggle} disabled={isFinished}>
                    {isRunning ? 'Стоп' : 'Возобновить'}
                </button>
                <button onClick={handleRestart} className="restart-btn">Рестарт</button>
                <button onClick={handleClose} className="close-btn">×</button>
            </div>
        </div>
    );
};

export default LiveTimer;