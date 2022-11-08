import { BaseGoals } from "./BaseGoals"

export class VariableGoals extends BaseGoals {

  constructor() {
    super()
  }

  public getClearedLinesGoals(level: number, totalLinesCleared: number): number {
    const newGoal = totalLinesCleared + (level * 5)
    return newGoal
  }
}