import BasePhase from "./BasePhase.js";

export default class Falling extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute(appState, setAppState) {
    // console.log('>>>> FALLING PHASE')
    this.syncToLocalState(appState)
    
    if (appState.playerAction.softDrop === true) {
      if (appState.fallIntervalId) {
        return
      }
      // Kickoff softdrop fall interval
      setAppState({ fallIntervalId: this.setContinuousFallEvent(appState, setAppState) })
      return
    } 
    
    // Kickoff regular fall interval
    if (appState.fallIntervalId === null) {
      setAppState({ fallIntervalId: this.setContinuousFallEvent(appState, setAppState) })
    }
  }

  setContinuousFallEvent(appState, setAppState) {
    return setInterval(this.continuousFallEvent.bind(this), appState.fallSpeed, setAppState)
  }

  continuousFallEvent(setAppState) {
    
    const { playField, currentTetrimino, fallIntervalId } = this.localState
    const newState = {}

    const { 
      newPlayField, 
      newTetrimino, 
      successfulMove
    } = this.tetriminoMovementHandler.moveOne('down', playField, currentTetrimino)
    
    if (successfulMove)  {

      if (this.localState.playerAction.softdrop) {
        newState.totalScore = this.awardSoftDropScore()
      }

      newState.currentTetrimino = newTetrimino
      newState.playField = newPlayField
      setAppState(newState)
      return
    }

    clearInterval(fallIntervalId)
    newState.fallIntervalId = null
    newState.currentGamePhase = 'lock'
    setAppState(newState)
  }

  awardSoftDropScore() {
    const scoreData = { currentScore: this.localState.totalScore }
    const scoreItem = ['softdrop', scoreData]
    return this.scoringHandler.updateScore(this.localState, scoreItem)
  }
  
}