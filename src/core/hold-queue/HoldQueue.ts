import { appStateIF, eventDataIF } from "../../interfaces/AppState.js"
import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"

export class HoldQueue {

  private holdQueueState: {}

  constructor() {
    this.holdQueueState = {}
  }

  setHoldQueueState(state: appStateIF) {
    this.holdQueueState = state.holdQueue
  }

  handleHoldQueueToggle(appState: appStateIF, eventData: eventDataIF) {
    this.setHoldQueueState(appState)

    

  }
}