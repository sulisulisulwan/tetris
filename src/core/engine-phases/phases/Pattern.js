import BasePhase from "./BasePhase.js";

export default class Pattern extends BasePhase {

  constructor(sharedHandlers, possibleActivePatterns) {
    super(sharedHandlers)
    this.loadedPatterns = this.loadPatterns(possibleActivePatterns)
  }

  execute() {
    // console.log('>>>> PATTERN PHASE')

    const newState = {}
    newState.scoringContextsForCompletion = this.localState.scoringContextsForCompletion
    newState.currentGamePhase = 'iterate'
    newState.eliminationActions = this.runPatternScanners() 
    newState.scoringHistoryPerCycle = this.localState.scoringHistoryPerCycle
    newState.eliminationActions.forEach(action => {

      switch (action.eliminatorName) {
        case 'lineClear':
          const { performedTSpinMini, performedTSpin, currentLevel } = this.localState
          const linesCleared = action.actionData.length
          newState.backToBack = linesCleared === 4 || (performedTSpin || performedTSpinMini) ? true : false
          newState.scoringHistoryPerCycle.lineClear = true
          newState.totalLinesCleared = this.localState.totalLinesCleared + action.actionData.length

          const scoringData = { 
            currentLevel: currentLevel,
            linesCleared: linesCleared, 
            performedTSpin: performedTSpin,
            performedTSpinMini: performedTSpinMini,
            backToBack: newState.backToBack && this.localState.backToBack ? true : false // First back to back qualifier in chain doesn't count
          }
          newState.scoringContextsForCompletion.push({
            scoringMethodName: 'lineClear',
            scoringData
          })

          break
        default:
          break
      }

    })

    this.setAppState(newState)
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

  // In this phase, we only mark the lines to be cleared.  We can map the return action object to functions in future phases
  // that take care of playfield clearing, animations, etc.
  lineClear() {
    const rowsToClear = []
    const { playfield } = this.localState

    playfield.forEach((row, index) => {
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

/**
 * In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
 * once a pattern has been matched, it can trigger any number of tetris variant-related effects.
 * the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
 * of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
 * marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later 
 * time in the eliminate Phase.
 */