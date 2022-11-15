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
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default Options