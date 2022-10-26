import BasePhase from "./BasePhase.js";

export default class Eliminate extends BasePhase {
  
  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>>> ELIMINATE PHASE')

    const newPlayfield = this.runEliminators()
    
    this.setAppState({
      currentGamePhase: 'completion',
      playfield: newPlayfield
    })
  }

  // We will have to refactor the pattern/elimination routines so
  // that we create a "marked" playfield as opposed to a list of
  // indices to remove.  This would allow us to eliminate minos from
  // the playfield, update the playfield with each eliminate action,
  // and still be able to target minos with subsequent actions.  currently
  // subsequent actions will break as indices and individual squares 
  // can't be updated in an easy way.
  runEliminators() {
    const actions = this.localState.eliminationActions
    let newPlayfield = this.localState.playfield

    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i]
      const { eliminatorName, actionData } = action
      newPlayfield = this[eliminatorName](newPlayfield, actionData)
    }

    return newPlayfield
  }

  lineClear(playfield, actionData) {
    const filteredPlayfield = playfield.filter((row, index) => {
      const isTargetRow = actionData.includes(index) 
      return !isTargetRow
    })

    let newRows = new Array(40 - filteredPlayfield.length).fill(null)
    newRows = newRows.map(row => new Array(10).fill('[_]', 0, 10))
    return newRows.concat(filteredPlayfield)
  }

}

/**
 * Any Minos marked for removal, i.e., on the hit list, are cleared from the 
 * Matrix in this phase. If this results in one or more complete 10-cell rows
 * in the Matrix becoming unoccupied by Minos, then all Minos above that row(s) 
 * collapse, or fall by the number of complete rows cleared from the Matrix. 
 * Points are awarded to the player according to the tetris Scoring System, as
 * seen in the scoring section.  game statistics  such as the number of Singles, 
 * doubles, triples, tetrises, and t-Spins can also be tracked in the eliminate 
 * Phase. Ideally, some sort of High Score table should record the player’s name, 
 * the highest level reached, his total score, and other statistics that can be 
 * tracked in this phase.
 */