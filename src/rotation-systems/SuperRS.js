import { gridCoordsAreClear } from '../utils/utils.js'

export class SuperRotationSystem {

  constructor() {
    this.relativeOrientations = {
      north: { left: 'west', right: 'east' },
      south: { left: 'east', right: 'west' },
      east:  { left: 'north', right: 'south' },
      west:  { left: 'south', right: 'north' },
    }
  }

  /**
   * 
   * Public facing method used upon player flip input.  
   * Returns either the grid coordinates of the new flipped position 
   * OR null to signify flip isn't possible.
   * 
   * @param {*} tetrimino 
   * @param {*} playerInput 
   * @param {*} currPlayField 
   * 
   * @returns number[][] 
   * 2 dimensional array where each inner array represents a tetrimino square
   * Innermost arrays contain two ints, the first representing vertical coordinate, the second the horizontal coordinate
   * 
   */

  getValidTargetGridCoords(tetrimino, playerInput, currPlayField) {
    return tryFlipPoints(tetrimino, playerInput, currPlayField)
  }
  

  tryFlipPoints(tetrimino, playerInput, currPlayField) {
    
    const { currentOrientation } = tetrimino
    const targetOrientation = this.getTargetOrientation(currentOrientation, playerInput)

    const startPositionsData = tetrimino.orientations[currentOrientation]
    const endPositionsData = tetrimino.orientations[targetOrientation]

    const targetPrimaryPosition = endPositionsData.primaryPosition

    let flipPoint = 1

    while (flipPoint <= 5) {
      console.log(`Offset for playeInput=${playerInput} and flipPoint=${flipPoint} with ITetrimino starting ${currentOrientation.toUpperCase()} flipping to ${targetOrientation.toUpperCase()}`)
      const startPoint = startPositionsData.rotationPoints[flipPoint]
      const endPoint = endPositionsData.rotationPoints[flipPoint]

      const offsetTowardsStartPoint = this.calculateOffsetTowardsStartPoint(startPoint, endPoint)
      const targetPlayfieldCoords = this.calculateTargetPlayfieldCoords(targetPrimaryPosition, offsetTowardsStartPoint)

      if (this.flipIsValid(targetPlayfieldCoords, currPlayField)) { // COMMENT OUT WHEN TESTING
        return targetPlayfieldCoords
      }
      
      // this.renderFlipOnGrid(startPositionsData, targetPlayfieldCoords, tetrimino.startingGridPosition) // TESTING ONLY

      flipPoint += 1
    }

    return null

  }

  getTargetOrientation(currentOrientation, playerInput) {
    return this.relativeOrientations[currentOrientation][playerInput]
  }

  calculateOffsetTowardsStartPoint(startPoint, endPoint) {
    const [ startX, startY ] = startPoint
    const [ endX, endY ] = endPoint
    return [ startX - endX, startY - endY]
  }

  calculateTargetPlayfieldCoords(targetPrimaryPosition, offset) {
    const [verticalOffset, horizontalOffset] = offset
    return targetPrimaryPosition.map(pointCoords => [pointCoords[0] + verticalOffset, pointCoords[1] + horizontalOffset])
  }

  flipIsValid(targetCoords, currPlayField) {
    return gridCoordsAreClear(targetCoords, currPlayField)
  }

  testFlipPoints(tetrimino, options) {
    options.testTheseOrientations.forEach(orientation => {
      tetrimino.setCurrentOrientation(orientation)
      this.tryFlipPoints(tetrimino, 'left', null)
      this.tryFlipPoints(tetrimino, 'right', null)
    })
  }

  renderFlipOnGrid(startPositionsData, targetPlayfieldCoords, generationPosition) {

    const testRows = new Array(40).fill(null)
    const testGrid = testRows.map(row => new Array(10).fill(' ', 0, 10))

    const initialOrientation = startPositionsData.primaryPosition

    const [zeroVertical, zeroHorizontal] = generationPosition

    const originalIdxs = initialOrientation.map(coords => [zeroVertical + coords[0], zeroHorizontal + coords[1]])
    const targetIdxs = targetPlayfieldCoords.map(coords => [zeroVertical + coords[0], zeroHorizontal + coords[1]])
    
    originalIdxs.forEach(coords => testGrid[coords[0]][coords[1]] = testGrid[coords[0]][coords[1]] === ' ' ? '0' : ' ')
    targetIdxs.forEach(coords => testGrid[coords[0]][coords[1]] = testGrid[coords[0]][coords[1]] === ' ' ? '1' : 'x')
    
    testGrid.forEach(row => console.log(JSON.stringify(row)))
  }

}