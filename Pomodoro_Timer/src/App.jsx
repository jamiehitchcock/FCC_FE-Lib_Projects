import { useState } from 'react';
import SettingsContext from './SettingsContext';
import Timer from './Timer';

import classes from './styles/Root.module.scss'


function App() {

  const [sessionMins, setSessionMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);

  return (
    <>
      <div className={classes.container}>
        <h1>Pomodoro Timer</h1>
        <SettingsContext.Provider value={{
          sessionMins,
          breakMins,
          setSessionMins,
          setBreakMins
        }}>
          <Timer />
        </SettingsContext.Provider>
      </div>
    </>
  )
}

export default App