import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";



export default class Pregame extends BasePhase {
  
  constructor(handlerProps) {
    super()
    this.localState = {}
    this.handlerProps = handlerProps
  }
  
  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    console.log('>>> PREGAME PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

  }

}