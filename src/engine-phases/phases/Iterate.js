import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";
export default class Iterate extends BasePhase {

  constructor() {
    super()
    this.acquiredState = {}
  }

  execute(stateData, setState) {

    // console.log('>>>>>>>ITERATE PHASE')
    const stateCopy = makeCopy(stateData)
    this.setAcquiredState(stateCopy)

    console.log(this.acquiredState.eliminateActions)

    // In this phase, the engine is given a chance to scan through all cells in 
    // the Matrix and evaluate or manipulate them according to an editor-defined 
    // iteration script. this phase consumes no apparent game time. note: this
    // phase is included in the engine to allow for more complicated variants in 
    // the future, and has thus far not been used.

    setState({
      currentGamePhase: 'animate'
    })
  }

  setAcquiredState(state) {
    this.acquiredState = state
  }
}