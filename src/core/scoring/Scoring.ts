import { scoreItemIF } from '../../interfaces/AppState.js'
import { ClassicScoring } from './modes/Classic.js'

export class Scoring {

  private scoreModesMap: Map<string,any>
  public scoringHandler: ClassicScoring // should be a base class

  constructor(gameMode: string) {
    this.scoreModesMap = this.loadScoreModesMap()
    this.scoringHandler = this.loadScoringHandler(gameMode)
    this.updateScore = this.updateScore.bind(this)
  }

  updateScore(currentScore: number, scoreItem: scoreItemIF) {
    return this.scoringHandler.updateScore(currentScore, scoreItem)
  }

  loadScoringHandler(gameMode: string) {
    const ctor = this.scoreModesMap.get(gameMode)
    return new ctor()
  }

  loadScoreModesMap(): Map<string, any> {
    return new Map([
      ['classic', ClassicScoring ]
    ])
  }

}
