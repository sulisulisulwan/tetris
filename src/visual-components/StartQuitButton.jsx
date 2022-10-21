import React from 'react'

const StartQuitButton = ({ currentGamePhase, clickHandler }) => {

  let action = 'Start'
  if (currentGamePhase !== 'off') {
    action = 'Quit'
  }

  return (
    <div className="start-quit-button-wrapper">
      <button onClick={clickHandler}>{action}</button>
    </div>
  )
}

export default StartQuitButton