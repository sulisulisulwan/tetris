import { BaseGoals } from "./BaseGoals"

export class FixedGoals extends BaseGoals {

  private clearedLinesGoals: Map<number, number>

  constructor() {
    super()
    this.clearedLinesGoals = this.setClearedLinesGoalsMap()
  }

  public getClearedLinesGoals(level: number): number {
    return this.clearedLinesGoals.get(level)
  }

  private setClearedLinesGoalsMap() {
    return new Map([
      [1, 10],
      [2, 20],
      [3, 30],
      [4, 40],
      [5, 50],
      [6, 60],
      [7, 70],
      [8, 80],
      [9, 90],
      [10, 100],
      [11, 110],
      [12, 120],
      [13, 130],
      [14, 140],
      [15, 150]
    ])
  }

}