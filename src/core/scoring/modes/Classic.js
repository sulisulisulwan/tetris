export class ClassicScoring {

  constructor() {

    this.clearLineBaseScores = new Map([
      [1, 100],
      [2, 300],
      [3, 500],
      [4, 800],
      ['miniTSpin1', 200],
      ['tSpin1', 800],
      ['tSpin2', 1200],
      ['tSpin3', 1600]
    ])
  }

  // scoreContext can be passed from any part of the Application for any reason
  updateScore(appState, scoreContext) {
    const [scoringMethod, scoringData] = scoreContext
    return this[scoringMethod](scoringData)

  }

  // Found in Completion
  lineClear(scoringData) {

    const { currentScore, currentLevel, linesCleared, performedTSpin, performedMiniTSpin, backToBack } = scoringData
    const newState = {}

    let totalScore = currentScore
    if (linesCleared > 0 && linesCleared < 4) {
      if (performedTSpin || performedMiniTSpin) {
        const tSpinType = performedTSpin ? 'tSpin' : 'miniTSpin'
        const scoreBeforeBonus = (this.clearLineBaseScores.get(`${tSpinType}${linesCleared}`) * currentLevel)
        if (backToBack === false) {
          // Technically a mini T spin can only complete a single line.  If error, check t-spin recognition logic.
          newState.totalScore = totalScore + scoreBeforeBonus
          newState.backToBack = true
          newState.performedTSpin = false
          newState.performedMiniTSpin = false
          return newState
        }
        newState.totalScore = totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5)
        newState.performedTSpin = false
        newState.performedMiniTSpin = false
        return newState
      }
      const scoreBeforeBonus = this.clearLineBaseScores.get(linesCleared) * currentLevel
      if (backToBack) {
        newState.totalScore = totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5)
        newState.backToBack = false
        return newState
      }
      newState.totalScore = totalScore + scoreBeforeBonus
      return newState
    }

    // Tetris case
    const scoreBeforeBonus = (this.clearLineBaseScores.get(linesCleared) * currentLevel)
    if (backToBack === false) {
      newState.totalScore = totalScore + scoreBeforeBonus
      newState.backToBack = true
      return newState
    }
    newState.totalScore = totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5)
    return newState
  }

  tSpin(scoringData) {
    // Need to know 
      // Current level
    const { currentLevel } = scoringData

    // if called by a lineClear
      // RETURN lineClear score
    // RETURN normal score
  }

  tSpinMini(scoringData) {
    // Need to know 
      // Current level
    const { currentLevel } = scoringData

    // if called by a lineClear
      // RETURN lineClear score
    // RETURN normal score
  }

  softdrop(scoringData) {
    const { currentScore } = scoringData
    return currentScore + 1
  }

  harddrop(scoringData) {
    const { currentScore, linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }

}
