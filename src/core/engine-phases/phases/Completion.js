import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
import { Scoring } from "../../levels-and-scoring/Scoring.js";
import { LevelGoals } from "../../levels-and-scoring/LevelGoals.js";

export default class Completion extends BasePhase {

  constructor() {
    super()
    this.localState = {}
    this.scoringSystem = new Scoring('classic')
    this.levelGoalsSystem = new LevelGoals('fixed')
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    // console.log('>>>> COMPLETION PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    const scoringContexts = appState.scoringContextsForCompletion
    const newState = {}

    scoringContexts.forEach(scoringContext => {
      const data = this.scoringSystem.updateScore(appState, scoringContext)
      for (const field in data) {
        newState[field] = data[field]
      }
    })

    if (appState.totalLinesCleared > appState.levelClearedLinesGoal) {
      const newLevel = appState.currentLevel + 1
      const { levelClearedLinesGoal, fallSpeed } = this.levelGoalsSystem.getNewLevelSpecs(newLevel)
      
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