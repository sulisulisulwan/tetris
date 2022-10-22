import { FixedGoals } from "./goal-modes/Fixed.js"

export class LevelGoals {

  constructor(goalsMode) {
    this.fallSpeeds = this.loadFallSpeedsMap()
    this.goalModesMap = this.loadGoalModesMap()
    this.goalSpecsHandler = this.loadGoalSpecs(goalsMode)    
  }

  loadFallSpeedsMap() {
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

  loadGoalModesMap() {
    return new Map([
      ['fixed', FixedGoals]
    ])
  }
  loadGoalSpecs(goalsMode) {
    const ctor = this.goalModesMap.get(goalsMode)
    return new ctor()
  }

  getNewLevelSpecs(newLevel) {
    const newLevelSpecs = {
      levelClearedLinesGoal: this.goalSpecsHandler.clearedLinesGoals.get(newLevel),
      fallSpeed: this.fallSpeeds.get(newLevel)
    }

    return newLevelSpecs
  }

}