import { LineClear } from "../awards/LineClear.js"
export class ClassicScoring {

  constructor() {
    this.awardLineClear = new LineClear()
  }

  handleCompletionPhaseAccrual(currentScore, scoringContextsForCompletion, scoringHistoryPerCycle) {

    const filteredScoringContexts = scoringContextsForCompletion.filter(scoringContext => {
      const { scoringMethodName } = scoringContext

      if (scoringMethodName === 'tSpinNoLineClear' || scoringMethodName === 'tSpinMiniNoLineClear') {
        // skip this context as lineClear is the priority
        return scoringHistoryPerCycle.lineClear ? false : true
      }
      return true

    })

    const newTotalScore = filteredScoringContexts.reduce((runningScore, scoringContext) => {
      return this.updateScore(runningScore, scoringContext)
    }, currentScore)

    return newTotalScore

  }
  // scoreContext can be passed from any part of the Application for any reason
  updateScore(currentScore, scoreContext) {
    const { scoringMethodName, scoringData } = scoreContext
    return this[scoringMethodName](currentScore, scoringData)
  }

  // Executed within PlayerAction or Falling Phase
  softdrop(currentScore, scoringData) {
    return currentScore + 1
  }

  harddrop(currentScore, scoringData) {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }

  // Executed in Completion Phase
  lineClear(currentScore, scoringData) {
    const newTotalScore = this.awardLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  tSpinNoLineClear(currentScore, scoringData) {
    const { currentLevel } = scoringData
    const tSpinAward =  400 * currentLevel
    return currentScore + tSpinAward
  }

  tSpinMiniNoLineClear(currentScore, scoringData) {
    const { currentLevel } = scoringData
    const tSpinMiniAward =  100 * currentLevel
    return currentScore + tSpinMiniAward
    
  }

}
