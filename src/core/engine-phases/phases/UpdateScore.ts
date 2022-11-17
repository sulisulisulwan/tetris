import { appStateIF, genericObjectIF, scoreItemIF, sharedHandlersIF } from "../../../interfaces";
import BasePhase from "./BasePhase";
import ScoreItemFactory from "./ScoreItemFactory";

export default class UpdateScore extends BasePhase {

  private scoreItemFactory: ScoreItemFactory

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemFactory = new ScoreItemFactory(sharedHandlers)
  }

  public execute() {
    let newState = {} as appStateIF
    const newTotalScore = this.accrueScoreAndScoreHistory()

    if (this.localState.totalLinesCleared >= this.localState.levelClearedLinesGoal) {
      this.promoteLevel(newState)
    }

    newState.scoringItems = []
    newState.totalScore = newTotalScore
    newState.currentGamePhase = 'animate'
    this.setAppState(newState)

  }

  private accrueScoreAndScoreHistory() {
    const { scoreItems, scoreHistory } = this.getScoreItemsFromPatterns()
    const newTotalScore = this.scoringHandler.handleCompletionPhaseAccrual(this.localState.totalScore, scoreItems, scoreHistory)
    return newTotalScore
  }

  private getScoreItemsFromPatterns() {
    const scoreItems = [] as scoreItemIF[]
    const { patternItems } = this.localState

    const scoreHistory: genericObjectIF = {}

    patternItems.forEach(pattern => {
      const { type, data } = pattern
      scoreItems.push(this.scoreItemFactory.getItem(type, data))
      scoreHistory[type as keyof genericObjectIF] = true
    })

    return { scoreItems, scoreHistory}
  }

  private promoteLevel(newState: appStateIF) {
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