import BasePhase from "./BasePhase.js";
export default class Animate extends BasePhase {
  
  execute(stateData, setState) {
    // console.log('>>>>>>>ANIMATE PHASE')

    // Here, any animation scripts are executed within the Matrix. the tetris engine 
    // moves on to the eliminate Phase once all animation scripts have been run.

    setState({
      currentGamePhase: 'eliminate'
    })
  }
}