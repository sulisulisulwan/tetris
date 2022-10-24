import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";

export default class Completion extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }
  
  execute(appState, setAppState) {
    // console.log('>>>> COMPLETION PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    const scoringContexts = appState.scoringContextsForCompletion
    const newState = {}

    scoringContexts.forEach(scoringContext => {
      const data = this.scoringHandler.updateScore(appState, scoringContext)
      for (const field in data) {
        newState[field] = data[field]
      }
    })

    if (appState.totalLinesCleared > appState.levelClearedLinesGoal) {
      const newLevel = appState.currentLevel + 1
      const { levelClearedLinesGoal, fallSpeed } = this.levelGoalsHandler.getNewLevelSpecs(newLevel)
      
      newState.currentLevel = newLevel
      newState.levelClearedLinesGoal = levelClearedLinesGoal
      newState.fallSpeed = fallSpeed
    }

    newState.currentGamePhase = 'generation'

    setAppState(newState)
  }

}

/**
 * this is where any updates to information fields on the tetris playfield are updated, 
 * such as the Score and time. the Level up condition is also checked to see if it is 
 * necessary to advance the game level.
 */