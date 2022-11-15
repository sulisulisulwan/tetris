import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../../interfaces'

interface singlePlayerPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class SinglePlayer extends React.Component<singlePlayerPropsIF> {

  constructor(props: singlePlayerPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="singleplayer-menu">
        SINGLE PLAYER MENU
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'loadGame'}}) }}>[START]</div>
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default SinglePlayer