import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../interfaces'

interface menuPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

const Menu = (props: menuPropsIF) => {

  const { setAppState } = props
  return(
    <div className="title-menu">
      <ul>
        <li onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'singlePlayer'}}) }}>Single Player</li>
        <li onClick={() => { setAppState((currentState) => { return { ...currentState,  view: 'multiPlayer'}}) }}>Multi Player</li>
        <li onClick={() => { setAppState((currentState) => { return { ...currentState,  view: 'options'}}) }}>Options</li>
        <li onClick={() => { setAppState((currentState) => { return { ...currentState,  view: 'highScore'}}) }}>HighScore</li>
        <li onClick={() => { setAppState((currentState) => { return { ...currentState,  view: 'help'}}) }}>Help</li>
      </ul>
    </div>
  )
}

export default Menu