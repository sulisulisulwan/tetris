import { appStateIF, eventDataIF } from "../../interfaces/index.js"

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