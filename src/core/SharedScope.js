export class SharedScope {
  constructor(sharedHandlers) {

    this.scoringHandler = sharedHandlers.scoringHandler
    this.levelGoalsHandler = sharedHandlers.levelGoalsHandler
    this.tetriminoMovementHandler = sharedHandlers.tetriminoMovementHandler
    this.localState = {}
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

}