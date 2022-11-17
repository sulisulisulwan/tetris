import { genericObjectIF, lineClearPatternDataIF, patternDataIF, patternItemIF, scoreItemIF, sharedHandlersIF } from "../../../interfaces"
import { SharedScope } from "../../SharedScope"

export default class ScoreItemFactory extends SharedScope {

  /**
   * Organizes data currently held in state and data computed between state changes into an item for
   * consumption by the scoring handlers.
   */

  private scoreItemDataMap: Map<string, any>

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
    this.scoreItemDataMap = new Map([
      ['lineClear', this.buildLineClearData.bind(this)],
      ['softdrop', this.buildSoftdropData.bind(this)],
      ['harddrop', this.buildHarddropData.bind(this)]
    ]) 
  }

  public getItem(type: string, nonStateData: patternDataIF | null) {

    const scoreItemDataBuilder = this.scoreItemDataMap.get(type)

    const scoreItem: scoreItemIF= {
      type,
      data: scoreItemDataBuilder(nonStateData)
    }

    return scoreItem
  }

  private buildLineClearData(patternData: lineClearPatternDataIF) {
    const { performedTSpinMini, performedTSpin } = this.localState
    const linesCleared = patternData.linesCleared
    const backToBackCondition1 = linesCleared === 4 || (performedTSpin || performedTSpinMini) ? true : false
    const backToBackCondition2 = this.localState.backToBack
    const backToBack = backToBackCondition1 && backToBackCondition2
    return { 
      linesCleared,
      backToBack,
      currentLevel: this.localState.currentLevel,
      performedTSpin: this.localState.performedTSpin,
      performedTSpinMini: this.localState.performedTSpinMini,
    }

  }

  private buildSoftdropData() {
    return { 
      currentScore: this.localState.totalScore 
    }
  }
  private buildHarddropData(data: genericObjectIF) {
    return { 
      currentScore: this.localState.totalScore,
      linesDropped: data.linesDropped
    }
  }
}