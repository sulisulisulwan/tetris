import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../interfaces'

interface multiPlayerPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class MultiPlayer extends React.Component<multiPlayerPropsIF> {

  constructor(props: multiPlayerPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="multiplayer-menu">
        MULTIPLAYER MENU
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default MultiPlayer