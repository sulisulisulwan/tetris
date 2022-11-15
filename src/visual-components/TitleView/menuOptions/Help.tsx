import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../interfaces'

interface helpPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

class Help extends React.Component<helpPropsIF> {

  constructor(props: helpPropsIF) {
    super(props)
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="help-view">
        HELP MENU
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default Help