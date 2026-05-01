import { useState, useEffect } from "react";
import "../../../styles/LiveTimer.css";

const LIVE_TIMER_KEY = 'live_timer_state';
// Отсчетное время для таймера, переводим часы и минуты в секунды
const INITIAL_TIME = 59 * 60 + 59; // 0:59:59

const LiveTimer = ({ onClose }) => {
    // Читаем начальное состояние из памяти, либо берем дефолтное
    const getInitialState = () => {
        try {
            const saved = localStorage.getItem(LIVE_TIMER_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Ошибка чтения таймера", e);
        }
        return { timeLeft: INITIAL_TIME, isRunning: true, isFinished: false };
    }

    const initialState = getInitialState();
    const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
    const [isRunning, setIsRunning] = useState(initialState.isRunning);
    const [isFinished, setIsFinished] = useState(initialState.isFinished);

    // Сохраняем состояние в память при каждом изменении
    useEffect(() => {
        const stateToSave = { timeLeft, isRunning, isFinished };
        localStorage.setItem(LIVE_TIMER_KEY, JSON.stringify(stateToSave));
    }, [timeLeft, isRunning, isFinished]);

    // Форматируем время
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Логика отсчета
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

    // Слушаем изменения в других вкладках
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === LIVE_TIMER_KEY && e.newValue) {
                const newState = JSON.parse(e.newValue);
                setTimeLeft(newState.timeLeft);
                setIsRunning(newState.isRunning);
                setIsFinished(newState.isFinished);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Закрываем таймер
    const handleClose = () => {
        if (onClose) onClose();
    };

    // Стоп/Возобновить
    const handleToggle = () => {
        if (!isFinished) {
            setIsRunning(prev => !prev); // меняем тру/фолс
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
                <button onClick={handleRestart} className="restart-btn highlighted">Рестарт</button>
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