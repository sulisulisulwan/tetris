import { ClassicScoringHandler } from './modes/ClassicScoringHandler.js'

export class ScoringHandlerFactory {

  public static loadScoringHandler(gameMode: string) {
    const loadScoringHandlerMap = new Map([
      ['classic', ClassicScoringHandler ]
    ])

    const ctor = loadScoringHandlerMap.get(gameMode)
    return new ctor()
  }

}
