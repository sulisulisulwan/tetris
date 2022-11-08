import { BaseGoals } from "./modes/BaseGoals.js"
import { FixedGoals } from "./modes/Fixed.js"
import { VariableGoals } from "./modes/Variable.js"

export class LevelGoals {

  private fallSpeeds: Map<number, number>
  private goalModesMap: Map<string, BaseGoals>
  private goalSpecsHandler: BaseGoals 

  constructor(mode: string) {
    this.fallSpeeds = this.loadFallSpeedsMap()
    this.goalModesMap = this.loadGoalModesMap()
    this.goalSpecsHandler = this.loadGoalSpecs(mode)    
  }

  loadFallSpeedsMap(): Map<number, number> {
    // level, seconds till dropping to next line
    return new Map([
      [1, 1000],
      [2, 793],
      [3, 618],
      [4, 473],
      [5, 355],
      [6, 262],
      [7, 190],
      [8, 135],
      [9, 94],
      [10, 64],
      [11, 43],
      [12, 28],
      [13, 18],
      [14, 11],
      [15, 7],
    ])
  }

  loadGoalModesMap(): Map<string, any> {
    return new Map([
      ['fixed', FixedGoals],
      ['variable', VariableGoals]
    ])
  }
  loadGoalSpecs(mode: string): BaseGoals {
    const ctor = this.goalModesMap.get(mode)
    return new ctor()
  }

  getNewLevelSpecs(newLevel: number, totalLinesCleared: number) { 
    return {
      levelClearedLinesGoal: this.goalSpecsHandler.getClearedLinesGoals(newLevel, totalLinesCleared),
      fallSpeed: this.fallSpeeds.get(newLevel)
    }
  }

}