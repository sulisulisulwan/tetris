import { scoringDataIF } from "../../../interfaces/AppState"

export class LineClear {

  private clearLineBaseScores: Map<string | number, number>

  constructor() {
    this.clearLineBaseScores = new Map<string | number, number>([
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


  calculateScore(currentScore: number, scoringData: scoringDataIF) {

    const { currentLevel, linesCleared, performedTSpin, performedTSpinMini, backToBack } = scoringData
    let totalScore = currentScore

    if (linesCleared === 4) {
      const scoreBeforeBonus = (this.clearLineBaseScores.get(linesCleared) * currentLevel)
      return backToBack ? totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5) : totalScore + scoreBeforeBonus
    }

    if (performedTSpin || performedTSpinMini) {
      const tSpinType = performedTSpin ? 'tSpin' : 'miniTSpin'
      const tSpinBaseScore = this.clearLineBaseScores.get(`${tSpinType}${linesCleared}`)
      const scoreBeforeBonus = (tSpinBaseScore * currentLevel)
      if (backToBack) {
        console.log('awarded Back to Back!!')
      }
      return backToBack ? totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5) : totalScore + scoreBeforeBonus
    }

    const scoreBeforeBonus = this.clearLineBaseScores.get(linesCleared) * currentLevel
    return backToBack ? totalScore + scoreBeforeBonus + (scoreBeforeBonus * 0.5) : totalScore + scoreBeforeBonus
  }
  
}