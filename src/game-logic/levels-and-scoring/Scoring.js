import { ClassicScoring } from './scoring-modes/Classic.js'

export class Scoring {

  constructor(gameMode) {
    this.scoreModesMap = this.loadScoreModesMap()
    this.scoringHandler = this.init(gameMode)

    this.updateScore = this.updateScore.bind(this)
  }

  init(gameMode) {
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

// These static classes should correspond with Pattern Engine class, which should update
