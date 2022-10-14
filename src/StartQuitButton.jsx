import React from 'react'

const StartQuitButton = ({ gamePhase, clickHandler }) => {

  let action = 'Start'
  if (gamePhase !== 'pregame') {
    action = 'Quit'
  }

  return (
    <div className="start-quit-button-wrapper">
      <button onClick={clickHandler}>{action}</button>
    </div>
  )
}

export default StartQuitButton