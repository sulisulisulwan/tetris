import { scoringDataIF, scoreItemIF, scoringItemsForCompletionIF, scoringHistoryPerCycleIF } from "../../../interfaces/AppState.js"
import { LineClear } from "../awards/LineClear.js"


export class ClassicScoring {

  private awardLineClear: LineClear

  constructor() {
    this.awardLineClear = new LineClear()
  }

  handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: scoringItemsForCompletionIF[], 
    scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ) {

    const filteredScoringContexts = scoreItemsForCompletion.filter((scoreItem: scoreItemIF) => {
      const { scoringMethodName } = scoreItem

      if (scoringMethodName === 'tSpinNoLineClear' || scoringMethodName === 'tSpinMiniNoLineClear') {
        // skip this context as lineClear is the priority
        return scoringHistoryPerCycle.lineClear ? false : true
      }
      return true

    })


    const newTotalScore = filteredScoringContexts.reduce((runningScore: number, scoreItem: scoreItemIF) => {
      return this.updateScore(runningScore, scoreItem)
    }, currentScore)

    return newTotalScore

  }
  // scoreContext can be passed from any part of the Application for any reason
  updateScore(currentScore: number, scoreItem: scoreItemIF) {
    const { scoringMethodName, scoringData } = scoreItem
    return this[scoringMethodName](currentScore, scoringData)
  }

  // Executed within PlayerAction or Falling Phase
  softdrop(currentScore: number, scoringData: scoringDataIF) {
    return currentScore + 1
  }

  harddrop(currentScore: number, scoringData: scoringDataIF) {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }

  // Executed in Completion Phase
  lineClear(currentScore: number, scoringData: scoringDataIF) {
    const newTotalScore = this.awardLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  tSpinNoLineClear(currentScore: number, scoringData: scoringDataIF) {
    const { currentLevel } = scoringData
    const tSpinAward =  400 * currentLevel
    return currentScore + tSpinAward
  }
  
  tSpinMiniNoLineClear(currentScore: number, scoringData: scoringDataIF) {
    const { currentLevel } = scoringData
    const tSpinMiniAward =  100 * currentLevel
    return currentScore + tSpinMiniAward
    
  }

}
