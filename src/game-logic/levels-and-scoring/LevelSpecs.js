export class LevelsAndScoring {

  constructor() {
    this.fallSpeeds = this.loadFallSpeedsMap()


    // const something ={
    //   goalToPassLevel: "??",
    //   progressToGoalCompletion: "??"
    // }
    
  }


  init(gameMode = 'classic') {
    this.loadGoalSpecs(gameMode)
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

  loadGoalSpecs(gameMode) {

  }

  analyze
}