import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../interfaces'
import MultiOptionField from './MultiOptionField'
import RangeField from './RangeField'
import ToggleField from './ToggleField'

interface optionsPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

type lockdownMode = [number, string]

interface optionsStateIF {
  startingLevel: number
  ghostPiece: boolean
  nextQueueSize: number
  holdQueue: boolean
  lockDownMode: lockdownMode
}

class Options extends React.Component<optionsPropsIF, optionsStateIF> {

  protected lockDownModes: Map<number, string>

  constructor(props: optionsPropsIF) {
    super(props)
    this.state = {
      startingLevel: 1,
      ghostPiece: true,
      nextQueueSize: 6,
      holdQueue: true,
      lockDownMode: [2, 'extended']
    }

    this.lockDownModes = new Map([
      [1, 'classic'],
      [2, 'extended'],
      [3, 'infinite']
    ])

    this.onClickRangeWrapper = this.onClickRangeWrapper.bind(this)
    this.onClickToggleHandler = this.onClickToggleHandler.bind(this)
    this.onClickMultiOptionHandler = this.onClickMultiOptionHandler.bind(this)

  }


  onClickRangeWrapper(options: any) {

    const { min, max, context, stateField } = options

    let oldState = this.state[stateField as keyof optionsStateIF] as number

    if (context === '+') {
      if (oldState < max) {
        oldState += 1
      }
    } else if (context === '-') {
      if (oldState > min) {
        oldState -= 1
      }
    }

    const newState = oldState
    this.setState((prevState) => { return { ...prevState, [stateField]: newState }})
  }


  onClickToggleHandler(options: any) {

    const { stateField } = options

    const newState = !this.state[stateField as keyof optionsStateIF]
    this.setState((prevState) => { return { ...prevState, [stateField]: newState }})

  }


  onClickMultiOptionHandler(options: any) {
    const { min, max, stateField, context, optionsMap } = options

    const [numericKey, option] = this.state[stateField as keyof optionsStateIF] as any
    let newNumericKey = context === '<' ? numericKey - 1: numericKey + 1

    if (newNumericKey < min) {
      newNumericKey = max
    } else if (newNumericKey > max) {
      newNumericKey = min
    }

    let newOption = optionsMap.get(newNumericKey)
    let newState = [ newNumericKey, newOption]

    this.setState((prevState) => { return { ...prevState, [stateField]: newState }})
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <div className="options-menu">
        OPTIONS MENU
        <ul>
          <li>Game Variation</li>
          <li>
            Starting Level
            <RangeField
              onClickRangeHandler={this.onClickRangeWrapper}
              currentValue={this.state.startingLevel as number}
              options={{ min: 1, max: 15, context: null, stateField: 'startingLevel'}}
              />
          </li>
          <li>
            Ghost Piece
            <ToggleField
              onClickToggleHandler={this.onClickToggleHandler}
              currentValue={this.state.ghostPiece}
              options={{ stateField: 'ghostPiece'}}
            />
          </li>
          <li>Starting Lines. Should this be within game modes?</li>
          <li>
            Next Queue Size (1 - 6)
            <RangeField
              onClickRangeHandler={this.onClickRangeWrapper}
              currentValue={this.state.nextQueueSize}
              options={{ min: 1, max: 6, context: null, stateField: 'nextQueueSize' }}
            />
          </li>
          <li>Hold Queue (on/off)</li>
            <ToggleField
              onClickToggleHandler={this.onClickToggleHandler}
              currentValue={this.state.holdQueue}
              options={{ stateField: 'holdQueue'}}
            />
          <li>Lock Down Mode</li>
            <MultiOptionField
              onClickMultiOptionHandler={this.onClickMultiOptionHandler}
              currentValue={this.state.lockDownMode}
              options={{ min: 1, max: 3, stateField: 'lockDownMode', optionsMap: this.lockDownModes }}
            />
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