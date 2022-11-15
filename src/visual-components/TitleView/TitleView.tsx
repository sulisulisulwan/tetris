import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../interfaces'
import Logo from './Logo'
import Menu from './Menu'

interface titleViewPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

const titleViewStyles = {
  color: 'white',
  fontFamily: 'Andale Mono'
}

class TitleView extends React.Component<titleViewPropsIF> {

  constructor(props: titleViewPropsIF) {
    super(props)
  }

  render() {

    return(
      <div className="title-view" style={titleViewStyles}>
        <Logo/>
        <Menu 
          appState={this.props.appState}
          setAppState={this.props.setAppState}
        />
      </div>
    )
  }
}

export default TitleView