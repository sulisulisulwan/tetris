import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
export default class Pattern extends BasePhase {

  constructor(initialGameState) {
    super()

    this.acquiredState = {}
    this.patternMetadata = {
      lineClear: {
        priority: 1
      }
    }
    this.loadedPatterns = this.loadPatterns(initialGameState.possibleActivePatterns)
  }
    // In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
    // once a pattern has been matched, it can trigger any number of tetris variant-related effects.
    // the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
    // of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
    // marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later 
    // time in the eliminate Phase.

  loadPatterns(possibleActivePatterns) {

    const patternsToLoad = []

    for (const pattern in possibleActivePatterns) {
      const currPatternActive = possibleActivePatterns[pattern]
      if (currPatternActive) {
        patternsToLoad.push(pattern)
      }
    }

    return patternsToLoad
  }

  execute(stateData, setState) {

    // console.log('>>>> PATTERN PHASE')
    const stateCopy = makeCopy(stateData)
    this.setAcquiredState(stateCopy)
    
    const eliminationActions = this.runPatternScanners() 

    setState({
      currentGamePhase: 'iterate',
      eliminationActions
    })
  }

  runPatternScanners() {
    const patterns = this.loadedPatterns
    const actions = []
    patterns.forEach(pattern => {
      const scanner = this[pattern].bind(this)
      const action = scanner()
      if (action) { 
        actions.push(action)
      }
    })
    return actions
  }
  
  setAcquiredState(state) {
    this.acquiredState = state
  }

  // In this phase, we only mark the lines to be cleared.  We can map the return action object to functions in future phases
  // that take care of playfield clearing, animations, etc.
  lineClear() {
    const rowsToClear = []
    const { playField } = this.acquiredState

    playField.forEach((row, index) => {
      if (row.every(square => square !== '[_]')) {
        rowsToClear.push(index)
      }
    })

    const actionItem = { 
      eliminatorName: 'lineClear', 
      actionData: rowsToClear 
    } 

    return rowsToClear.length ? actionItem : null
  }

}