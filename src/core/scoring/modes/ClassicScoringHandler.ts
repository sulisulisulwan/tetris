import { scoringDataIF, scoreItemIF, scoringHistoryPerCycleIF } from "../../../interfaces/index.js"
import { LineClear } from "../awards/LineClear.js"
import { BaseScoringHandler } from "./BaseScoringHandler.js"


export class ClassicScoringHandler extends BaseScoringHandler {

  private awardLineClear: LineClear

  constructor() {
    super()
    this.awardLineClear = new LineClear()

    this.scoringMethods = {
      awardLineClear: this.awardLineClear
    }
    
  }

  public handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: scoreItemIF[], 
    scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ): number {

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
