import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../interfaces'

interface optionsPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class Options extends React.Component<optionsPropsIF> {

  constructor(props: optionsPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="options-menu">
        OPTIONS MENU
        <ul>
          <li>Game Variation</li>
          <li>Starting Level</li>
          <li>Ghost Piece</li>
          <li>Starting Lines. Should this be within game modes?</li>
          <li>Next Queue Size (1 - 6)</li>
          <li>Hold Queue (on/off)</li>

          <li>Lock Down Mode</li>
          <li>
            Background Music
            <ul>
              <li>Song (could be selected or Random Play)</li>
              <li>Volume</li>
            </ul>
          </li>
          <li>Sounds (volume adjustment)</li>
          <li>Key Configurations</li>
        </ul>
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default Options