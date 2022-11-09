import { scoringDataIF, scoreItemIF, scoringHistoryPerCycleIF, scoringMethodsIF } from "../../../interfaces"

export abstract class BaseScoringHandler {


  protected scoringMethods: scoringMethodsIF
  constructor() {
    this.scoringMethods = {}
  }

  public abstract handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: scoreItemIF[], 
    scoringHistoryPerCycle: scoringHistoryPerCycleIF
  ): number

  // scoreContext can be passed from any part of the Application for any reason
  public updateScore(currentScore: number, scoreItem: scoreItemIF) {
    const { scoringMethodName, scoringData } = scoreItem
    return this.scoringMethods[scoringMethodName as keyof scoringMethodsIF].calculateScore(currentScore, scoringData)
  }
  // Executed within PlayerAction or Falling Phase
  protected abstract softdrop(currentScore: number, scoringData: scoringDataIF): number

  protected abstract harddrop(currentScore: number, scoringData: scoringDataIF): number

  protected abstract lineClear(currentScore: number, scoringData: scoringDataIF): number

  protected abstract tSpinNoLineClear(currentScore: number, scoringData: scoringDataIF): number
  
  protected abstract tSpinMiniNoLineClear(currentScore: number, scoringData: scoringDataIF): number
  

}
