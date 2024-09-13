import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ initialTime, onCountdownComplete }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(true); // Start running by default

    useEffect(() => {
        const savedStartTime = localStorage.getItem('startTime');

        if (savedStartTime) {
            const startTime = parseInt(savedStartTime, 10);
            const currentTime = Date.now();
            const timeElapsed = Math.floor((currentTime - startTime) / 1000);
            const remainingTime = initialTime - timeElapsed;

            if (remainingTime > 0) {
                setTimeLeft(remainingTime);
                setIsRunning(true);
            } else {
                setTimeLeft(0);
                localStorage.removeItem('startTime');
                setIsRunning(false);
                onCountdownComplete(); // Notify parent when time is complete
            }
        } else {
            const startTime = Date.now();
            localStorage.setItem('startTime', startTime);
            setIsRunning(true);
        }

        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(interval);
                        setTimeLeft(0);
                        setIsRunning(false);
                        localStorage.removeItem('startTime');
                        onCountdownComplete(); // Notify parent when countdown finishes
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Clear interval on component unmount or when time completes
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, initialTime, onCountdownComplete]);

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div>
            <span className="ms-1">{" "}  After {formatTime(timeLeft)}</span>
        </div>
    );
};

export default CountdownTimer;
