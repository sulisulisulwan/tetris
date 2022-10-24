import { makeCopy } from "./utils/utils.js"
export class SharedScope {
  constructor(sharedHandlers) {

    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.nextQueueHandler = sharedHandlers.nextQueueHandler
    this.localState = {}
  }

  syncToLocalState(appState) {
    const appStateCopy = makeCopy(appState)
    this.localState = appStateCopy
  }

}