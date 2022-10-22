export class ClassicScoring {

  constructor() {}

  // scoreContext can be passed from any part of the Application for any reason
  static updateScore(appState, scoreContext) {

    /**
     * ex. scoreContext = 
     * [
     *   'lineClear',
     *   {
     *     totalLines: <number of lines cleared>,
     *     tSpin: <boolean of whether not achieved by tSpin>,
     *     level
     *   }
     * ]
     *  
     * OR
     * 
     * [
     *   'harddrop',
     *   {
     *     totalLines: <number of lines dropped>
     *   }
     * ]
     * 
     * ETC. basically [<context>, <data to calculate on>]
     *  
     */

    const [scoringMethod, scoringData] = scoreContext
    return this[scoringMethod](scoringData)

  }

  static lineClear(scoringData) {

    // Need to know
      // Current score
      // Current Level
      // Amount of lines cleared
      // If a T-Spin was performed to clear those lines
      // If backToBack state is true or false
    const { score, currentLevel, linesCleared, throughTSpin, backToBack } = scoringData
    let totalScore = 0

    // Add current score to running score

    // check how many lines cleared
    // if single, double, and triple lines
      // Add base score multiplied by level
      // if achieved through t spin
        // if backToBack is false
          // calculate score WITHOUT backToBack bonus 
          // RETURN calculated score AND backToBack as TRUE AND tSpin as FALSE
        // calculate score WITH backToBack bonus
        // RETURN calculated score AND tSpin as FALSE
      // calculate score WITHOUT backToBack bonus
      // if backToBack was true
        // RETURN calculated score AND backToBack as FALSE
      // RETURN calculated score
    // Add base Score of Tetris multiplied by level
    // if backToBack is false
      // calculate WITHOUT backToBack bonus
      // RETURN calculated score AND backToBack as TRUE
    // calculate WITH backToBack bonus
    // RETURN calculated score

    return totalScore
  }

  static tSpin(scoringData) {
    // Need to know 
      // Current level
    const { currentLevel } = scoringData

    // if called by a lineClear
      // RETURN lineClear score
    // RETURN normal score
  }

  static tSpinMini(scoringData) {
    // Need to know 
      // Current level
    const { currentLevel } = scoringData

    // if called by a lineClear
      // RETURN lineClear score
    // RETURN normal score
  }

  static softdrop(scoringData) {
    const { currentScore } = scoringData
    return currentScore + 1
  }

  static harddrop(scoringData) {
    const { currentScore, linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }

}
