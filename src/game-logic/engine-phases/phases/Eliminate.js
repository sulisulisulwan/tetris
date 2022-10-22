import { makeCopy } from "../../utils/utils.js";
import BasePhase from "./BasePhase.js";



export default class Eliminate extends BasePhase {
  
  constructor() {
    super()
    this.localState = {}
  }

  syncToLocalState(appState) {
    this.localState = appState
  }

  execute(appState, setAppState) {
    // console.log('>>>> ELIMINATE PHASE')
    const appStateCopy = makeCopy(appState)
    this.syncToLocalState(appStateCopy)

    const newPlayField = this.runEliminators()

    setAppState({
      currentGamePhase: 'completion',
      playField: newPlayField
    })
  }

  // We will have to refactor the pattern/elimination routines so
  // that we create a "marked" playfield as opposed to a list of
  // indices to remove.  This would allow us to eliminate minos from
  // the playField, update the playField with each eliminate action,
  // and still be able to target minos with subsequent actions.  currently
  // subsequent actions will break as indices and individual squares 
  // can't be updated in an easy way.
  runEliminators() {
    const actions = this.localState.eliminationActions
    let newPlayField = this.localState.playField


    for (let i = 0; i < actions.length; i += 1) {
      const action = actions[i]
      const { eliminatorName, actionData } = action
      newPlayField = this[eliminatorName](newPlayField, actionData)
    }

    return newPlayField

  }

  lineClear(playField, actionData) {
    
    const filteredPlayField = playField.filter((row, index) => {
      const isTargetRow = actionData.includes(index) 
      return !isTargetRow
    })

    let newRows = new Array(40 - filteredPlayField.length).fill(null)
    newRows = newRows.map(row => new Array(10).fill('[_]', 0, 10))
    return newRows.concat(filteredPlayField)
     
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