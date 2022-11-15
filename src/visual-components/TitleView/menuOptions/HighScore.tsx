import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../interfaces'

interface highScorePropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

interface highScoreDataIF {
  name: string
  score?: number
  level?: number
  goalAttained?: number
}

//TODO:  We should be able to cycle through different high score tables for each game variation

class HighScore extends React.Component<highScorePropsIF> {

  private mockData: highScoreDataIF[] | null

  constructor(props: highScorePropsIF) {
    super(props)
    this.mockData = [
      { name: 'Ignatius', score: 2345345 },
      { name: 'Compitello', score: 345345 },
      { name: 'DFA', score: 34555 },
      { name: 'PooBros', score: 5453 },
      { name: 'Hana', score: 4354 },
      { name: 'Suli', score: 3424 },
      { name: 'Sami', score: 3421 },
      { name: 'Caeli', score: 3242 },
      { name: 'Laura', score: 1233 },
      { name: 'Someon1', score: 1212 },
      { name: 'Some2', score: 121 }
    ]
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="highscore-view">
        HIGH SCORE
        <ol>
          {this.mockData.map((highScore, i) => {
            return <li key={`${i}-${highScore.name}-${highScore.score}`}>{highScore.name} - {highScore.score}</li>
          })}
        </ol>
        <div onClick={() => { setAppState((currentState) => { return { ...currentState, view: 'title'}}) }}>[BACK]</div>
      </div>
    )
  }
}

export default HighScore