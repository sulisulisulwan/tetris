import { ClassicScoring } from './scoring-modes/Classic.js'

export class Scoring {

  constructor(gameMode) {
    this.scoreModesMap = this.loadScoreModesMap()
    this.scoringHandler = this.loadScoringHandler(gameMode)

    this.updateScore = this.updateScore.bind(this)
  }

  loadScoringHandler(gameMode) {
    const ctor = this.scoreModesMap.get(gameMode)
    return new ctor()
  }

  loadScoreModesMap() {
    return new Map([
      ['classic', ClassicScoring ]
    ])
  }

  updateScore(appState, scoreContext) {
    return this.scoringHandler.updateScore(appState, scoreContext)
  }

}
