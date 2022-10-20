import BasePhase from "./BasePhase.js";
export default class Completion extends BasePhase {
  execute(stateData, setState) {
    // console.log('>>>>>>>COMPLETION PHASE')

    // this is where any updates to information fields on the tetris playfield are updated, 
    // such as the Score and time. the Level up condition is also checked to see if it is 
    // necessary to advance the game level.

    setState({
      currentGamePhase: 'generation'
    })
  }
}