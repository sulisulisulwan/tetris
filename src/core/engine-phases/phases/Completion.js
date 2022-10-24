import BasePhase from "./BasePhase.js";

export default class Completion extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> COMPLETION PHASE')

    let newState = {}
    this.accrueScore(newState) 

    if (this.localState.totalLinesCleared > this.localState.levelClearedLinesGoal) {
      this.promoteLevel(newState)
    }

    newState.currentGamePhase = 'generation'
    this.setAppState(newState)
  }

  accrueScore(stateObj) {

    const scoringContexts = this.localState.scoringContextsForCompletion

    scoringContexts.forEach(scoringContext => {
      const data = this.scoringHandler.updateScore(this.localState, scoringContext)
      for (const field in data) {
        stateObj[field] = data[field]
      }
    })
  }

  promoteLevel(stateObj) {
    const newLevel = this.localState.currentLevel + 1
    const { 
      levelClearedLinesGoal, 
      fallSpeed 
    } = this.levelGoalsHandler.getNewLevelSpecs(newLevel)
    
    stateObj.currentLevel = newLevel
    stateObj.levelClearedLinesGoal = levelClearedLinesGoal
    stateObj.fallSpeed = fallSpeed
  }

}

/**
 * this is where any updates to information fields on the tetris playfield are updated, 
 * such as the Score and time. the Level up condition is also checked to see if it is 
 * necessary to advance the game level.
 */