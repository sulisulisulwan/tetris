export class FixedGoals {

  constructor() {
    this.clearedLinesGoals = this.setClearedLinesGoalsMap()
  }

  setClearedLinesGoalsMap() {
    return new Map([
      [1, 5],
      [2, 10],
      [3, 15],
      [4, 20],
      [5, 25],
      [6, 30],
      [7, 35],
      [8, 40],
      [9, 45],
      [10, 50],
      [11, 55],
      [12, 60],
      [13, 65],
      [14, 70],
      [15, 75]
    ])
  }
}