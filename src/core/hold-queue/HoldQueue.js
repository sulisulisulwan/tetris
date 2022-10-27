import { TetriminoFactory } from "../tetriminos/TetriminoFactory.js"

export class HoldQueue {

  constructor() {
    this.holdQueueState = {}
  }

  setHoldQueueState(state) {
    this.holdQueueState = state
  }

  handleHoldQueueToggle(appState, eventData) {
    this.setHoldQueueState(appState)

    

  }
}