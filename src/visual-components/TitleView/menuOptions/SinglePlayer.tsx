import * as React from 'react'
import { appStateIF, setAppStateIF } from '../../../interfaces'

interface singlePlayerPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

interface modeExplanationsIF {
  ultra: string
  sprint: string
  marathon: string
}

interface singlePlayerStateIF {
  selectedGameMode: string
}

class SinglePlayer extends React.Component<singlePlayerPropsIF, singlePlayerStateIF> {

  public modeExplanations: modeExplanationsIF

  constructor(props: singlePlayerPropsIF) {
    super(props)
    this.state = {
      selectedGameMode: 'marathon'
    }

    this.modeExplanations = {
      marathon: marathonExplanation,
      sprint: sprintExplanation,
      ultra: ultraExplanation
    }

  }

  getModeExplanation(mode: string): string {
    return this.modeExplanations[mode as keyof modeExplanationsIF]
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="singleplayer-menu">
        SINGLE PLAYER MENU
        <div>
          <button onClick={() => { this.setState({ selectedGameMode: 'marathon'}) }}>Marathon</button>
          <button onClick={() => { this.setState({ selectedGameMode: 'sprint'}) }}>Sprint</button>
          <button onClick={() => { this.setState({ selectedGameMode: 'ultra'}) }}>Ultra</button>
        </div>
        <div>
        <div>Selected Game Mode: {this.state.selectedGameMode.toUpperCase()}</div>
          {/**TODO: We must pass the game mode to top level app state.  But we must also build out infra for different game mode variations */}
        <div>{this.getModeExplanation(this.state.selectedGameMode)}</div>
          <button onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'loadGame'}}) }}>START</button>
        </div>
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

const marathonExplanation = "This is the traditional game of tetris. Here, the player competes purely for points over 15 levels of play, at which point the game ends. each tetris variant using the Marathon method of game play has a specific Level up condition."
const sprintExplanation = "The player chooses a starting level, and competes to clear a set number of lines (typically 40) in the shortest amount of time. the game ends when a game over Condition is met, or when the player clears the set number of lines. this game does not Level up."
const ultraExplanation = "the player’s objective is to a) score as many points, oR b) clear as many lines as possible within a two or three minute time span. the game ends when a game over Condition is met, or when the time limit expires. this game does not Level up."

export default SinglePlayer