import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "./SettingsContext";

// import react-circular progressbar from - https://www.npmjs.com/package/react-circular-progressbar
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import classes from './styles/Timer.module.scss'

function Timer() {

    // context
    const settingsInfo = useContext(SettingsContext);

    // state declarations
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("session");
    const [secondsRemaining, setSecondsRemaining] = useState(0);

    // references
    const isRunningRef = useRef(isRunning);
    const modeRef = useRef(mode);
    const secondsRemainingRef = useRef(secondsRemaining);

    // const totalSeconds = (mode === 'session' ? settingsInfo.sessionMins : settingsInfo.breakMins) * 60;

    const minutes = Math.floor(secondsRemaining / 60);
    let seconds = secondsRemaining % 60;

    function formatTimer() {
        function addZero(unit) {
            if (unit < 10) {
                return `0${unit}`
            } else {
                return unit
            }
        };
        return `${addZero(minutes)}:${addZero(seconds)}`;
    }

    function initTimer() {
        secondsRemainingRef.current = settingsInfo.sessionMins * 60;
        setSecondsRemaining(secondsRemainingRef.current);
    }

    function tickTimer() {
        secondsRemainingRef.current = secondsRemainingRef.current - 1;
        setSecondsRemaining(secondsRemainingRef.current);
    }

    // run everytime settingsInfo changes
    useEffect(() => {
        function changeMode() {
            const nextMode = modeRef.current === 'session' ? 'break' : 'session';
            const nextSeconds = (nextMode === 'session' ? settingsInfo.sessionMins : settingsInfo.breakMins) * 60;

            setMode(nextMode);
            modeRef.current = nextMode;

            setSecondsRemaining(nextSeconds);
            secondsRemainingRef.current = nextSeconds;
        }

        initTimer();

        const timerInterval = setInterval(() => {
            // if timer is not currently running do nothing
            if (!isRunningRef.current) {
                return;
            }
            // change timer mode if timer runs out
            if (secondsRemainingRef.current == 0) {
                playBeep();
                return changeMode();
            }

            tickTimer();
        }, 1000);

        // clear interval when unmounts
        return () => { clearInterval(timerInterval) };
    }, [settingsInfo]);

    function handleSessionIncrement() {
        if (settingsInfo.sessionMins < 60) {
            settingsInfo.setSessionMins(prevSessionMins => prevSessionMins + 1);
        }
    }

    function handleSessionDecrement() {
        if (settingsInfo.sessionMins > 1) {
            settingsInfo.setSessionMins(prevSessionMins => prevSessionMins - 1);
        }
    }

    function handleBreakIncrement() {
        if (settingsInfo.breakMins < 60) {
            settingsInfo.setBreakMins(prevBreakMins => prevBreakMins + 1);
        }
    }

    function handleBreakDecrement() {
        if (settingsInfo.breakMins > 1) {
            settingsInfo.setBreakMins(prevBreakMins => prevBreakMins - 1);
        }
    }

    function handleStopStart() {
        setIsRunning(!isRunning);
        isRunningRef.current = !isRunningRef.current;
    }

    function handleRestart() {
        // set to not running
        setIsRunning(false);
        isRunningRef.current = false;

        // change mode back to default
        modeRef.current = 'session';
        setMode(modeRef.current);

        // change settings to pass FCC Test
        settingsInfo.sessionMins = 25;
        settingsInfo.breakMins = 5;
        initTimer();
        stopAudio();
    }

    function formatLabel() {
        return modeRef.current === 'session' ? 'Focus Time Remaining' : 'Break Time Remaining';
    }

    function playBeep() {
        const beepAudio = document.getElementById('beep');
        beepAudio.play();
    }

    function stopAudio() {
        const beepAudio = document.getElementById('beep');
        beepAudio.pause();
        beepAudio.currentTime = 0;
    }

    console.log(settingsInfo);
    console.log(mode);
    console.log(secondsRemaining);

    const percentage = 66;

    // have progress bar percentage change with percentage of time 
    // style progress bar pathColor against mode

    return (
        <>
            <h1 id="timer-label">{formatLabel()}</h1>

            <div className={classes.progressContainer} id="time-left">
                    <CircularProgressbar value={percentage} text={formatTimer()} styles={buildStyles({ textColor: 'rgb(107, 22, 187)', pathColor: 'rgb(107, 22, 187)' })} />
            </div>

            <div className={classes.controls}>
                <button id="start_stop" onClick={handleStopStart}>{isRunning ? "Stop" : "Start"}</button>
                <button id="reset" onClick={handleRestart}>Reset</button>
            </div>


            <div className={classes.settings}>

                <div className={classes.settings__session}>
                    <div id="session-label">Session Length</div>
                    <div id="session-length">{settingsInfo.sessionMins}</div>
                    <div>
                        <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
                        <button id="session-increment" onClick={handleSessionIncrement}>+</button>
                    </div>
                </div>

                <div className={classes.settings__break}>
                    <div id="break-label">Break Length</div>
                    <div id="break-length">{settingsInfo.breakMins}</div>
                    <div>
                        <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
                        <button id="break-increment" onClick={handleBreakIncrement}>+</button>
                    </div>
                </div>

            </div>

            <audio src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" id='beep'></audio>
        </>
    )
} export default Timer;