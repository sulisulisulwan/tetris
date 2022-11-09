import { appStateIF, setAppStateIF, sharedHandlersIF } from "../interfaces/index.js"
import { HoldQueue } from "./hold-queue/HoldQueue.js"
import { LevelGoals } from "./level-goals/LevelGoals.js"
import { NextQueue } from "./next-queue/NextQueue.js"
import { BaseScoringHandler } from "./scoring/modes/BaseScoringHandler.js"
import { TetriminoMovementHandler } from "./tetriminos/movement-handler/TetriminoMovementHandler.js"
import { makeCopy } from "./utils/utils.js"
export class SharedScope {

  public scoringHandler: BaseScoringHandler
  public levelGoalsHandler: LevelGoals
  public tetriminoMovementHandler: TetriminoMovementHandler
  public nextQueueHandler: NextQueue
  public holdQueueHandler: HoldQueue
  public setAppState: setAppStateIF
  public localState: appStateIF


  constructor(sharedHandlers: sharedHandlersIF) {
    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.nextQueueHandler = sharedHandlers.nextQueueHandler
    this.holdQueueHandler = sharedHandlers.holdQueueHandler
    this.setAppState = sharedHandlers.setAppState
    this.localState = null
  }

  syncToLocalState(appState: appStateIF) {
    const appStateCopy = makeCopy(appState) as appStateIF
    this.localState = appStateCopy
  }

}