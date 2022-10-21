import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
export default class Animate extends BasePhase {
  
  constructor() {
    super()
    this.acquiredState = {}
  }

  execute(stateData, setState) {
    console.log('>>>>>>>ANIMATE PHASE')
    const stateCopy = makeCopy(stateData)
    this.setAcquiredState(stateCopy)

    // Here, any animation scripts are executed within the Matrix. the tetris engine 
    // moves on to the eliminate Phase once all animation scripts have been run.

    setState({
      currentGamePhase: 'eliminate'
    })
  }

  setAcquiredState(state) {
    this.acquiredState = state
  }
}