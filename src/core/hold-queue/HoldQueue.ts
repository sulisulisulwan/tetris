import { appStateIF, eventDataIF } from "../../interfaces"

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