import BasePhase from "./BasePhase.js";

export default class Completion extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> COMPLETION PHASE')

    let newState = {}
    const newTotalScore =  this.accrueScore() 

    if (this.localState.totalLinesCleared ===  this.localState.levelClearedLinesGoal) {
      this.promoteLevel(newState)
    }

    newState.scoringContextsForCompletion = []
    newState.scoringHistoryPerCycle = {}
    newState.currentGamePhase = 'generation'
    newState.currentTetrimino = null
    newState.performedTSpin = false
    newState.performedTSpinMini = false
    newState.totalScore = newTotalScore
    this.setAppState(newState)
  }

  accrueScore() {
    const { scoringHistoryPerCycle, scoringContextsForCompletion, totalScore} = this.localState
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(totalScore, scoringContextsForCompletion, scoringHistoryPerCycle)
    return newTotalScore
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
    stateObj.playerAction = this.localState.playerAction
    stateObj.playerAction.softdrop = false // Fixes math bug for softdrop where button trigger bleeds over to generation phase through level promotion
  }

}

/**
 * this is where any updates to information fields on the tetris playfield are updated, 
 * such as the Score and time. the Level up condition is also checked to see if it is 
 * necessary to advance the game level.
 */