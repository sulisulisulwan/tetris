import { appStateIF, sharedHandlersIF } from "../../../interfaces/index";
import BasePhase from "./BasePhase";

export default class Completion extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }
  
  execute() {
    // console.log('>>>> COMPLETION PHASE')

    let newState = {} as appStateIF
    const newTotalScore =  this.accrueScore() 

    if (this.localState.totalLinesCleared >= this.localState.levelClearedLinesGoal) {
      this.promoteLevel(newState)
    }

    newState.scoringItemsForCompletion = []
    newState.scoringHistoryPerCycle = {}
    newState.currentGamePhase = 'generation'
    newState.currentTetrimino = null
    newState.performedTSpin = false
    newState.performedTSpinMini = false
    newState.totalScore = newTotalScore
    this.setAppState(newState)
  }

  accrueScore() {
    const { scoringHistoryPerCycle, scoringItemsForCompletion, totalScore} = this.localState
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(totalScore, scoringItemsForCompletion, scoringHistoryPerCycle)
    return newTotalScore
  }

  promoteLevel(newState: appStateIF) {
    const newLevel = this.localState.currentLevel + 1
    const { 
      levelClearedLinesGoal, 
      fallSpeed 
    } = this.levelGoalsHandler.getNewLevelSpecs(newLevel, this.localState.totalLinesCleared)
    
    this.soundEffects.levelUp.play()

    newState.currentLevel = newLevel
    newState.levelClearedLinesGoal = levelClearedLinesGoal
    newState.fallSpeed = fallSpeed
    newState.playerAction = this.localState.playerAction
    newState.playerAction.softdrop = false // Fixes math bug for softdrop where button trigger bleeds over to generation phase through level promotion
  }

}

/**
 * this is where any updates to information fields on the tetris playfield are updated, 
 * such as the Score and time. the Level up condition is also checked to see if it is 
 * necessary to advance the game level.
 */