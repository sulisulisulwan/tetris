import { ClassicScoring } from './modes/Classic.js'

export class Scoring {

  constructor(gameMode) {
    this.scoreModesMap = this.loadScoreModesMap()
    this.scoringHandler = this.loadScoringHandler(gameMode)
    this.updateScore = this.updateScore.bind(this)
  }

  updateScore(appState, scoreContext) {
    return this.scoringHandler.updateScore(appState, scoreContext)
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

}
