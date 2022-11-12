import { appStateIF, setAppStateIF, sharedHandlersIF } from "../interfaces"
import { HoldQueue } from "./hold-queue/HoldQueue"
import { LevelGoals } from "./level-goals/LevelGoals"
import { NextQueue } from "./next-queue/NextQueue"
import { BaseScoringHandler } from "./scoring/modes/BaseScoringHandler"
import { TetriminoMovementHandler } from "./tetriminos/movement-handler/TetriminoMovementHandler"
import { TetriminoFactory } from './tetriminos/TetriminoFactory'
import { makeCopy } from "./utils/utils"
export class SharedScope {

  public scoringHandler: BaseScoringHandler
  public levelGoalsHandler: LevelGoals
  public tetriminoMovementHandler: TetriminoMovementHandler
  public tetriminoFactory: TetriminoFactory
  public nextQueueHandler: NextQueue
  public holdQueueHandler: HoldQueue
  public setAppState: setAppStateIF
  public localState: appStateIF


  constructor(sharedHandlers: sharedHandlersIF) {
    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.tetriminoFactory = TetriminoFactory
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