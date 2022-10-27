export class TSpinCalculator {

  /**                             0  1 
   *                   minoAt? = [y, x]
   *       v----------------------|--+
   *    x  x                      |
   * [                            |
   *  [_],[0],[_],     y          |
   *  [1],[2],[3],     y   <------+
   *  [_],[_],[_],     y
   * ]
   */

  /*
   * if the t-slot square isn't an empty square 
   * (either it's off the playfield (undefined) or filled with a tetrimino), 
   * it is a tslot
   */ 

  static getTSlotCorners_north(tetriminoCoordsOnPlayfield, playfield) {
    const isATSlotCorner = {}
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino1 = tetriminoCoordsOnPlayfield[1]
    const mino3 = tetriminoCoordsOnPlayfield[3]


    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]

    const down1From1 = playfield[mino1[0] + 1] ? playfield[mino1[0] + 1][mino1[1]] : undefined 
    const down1From3 = playfield[mino3[0] + 1] ? playfield[mino3[0] + 1][mino3[1]] : undefined

    isATSlotCorner.a = leftOf0 !== '[_]' 
    isATSlotCorner.b = rightOf0 !== '[_]'
    isATSlotCorner.c = down1From1 !== '[_]'
    isATSlotCorner.d = down1From3 !== '[_]'

    return isATSlotCorner
  }

  static getTSlotCorners_east(tetriminoCoordsOnPlayfield, playfield) {
    const isATSlotCorner = {}
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]
    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]

    isATSlotCorner.a = rightOf0 !== '[_]' 
    isATSlotCorner.b = rightOf3 !== '[_]' 
    isATSlotCorner.c = leftOf0 !== '[_]' 
    isATSlotCorner.d = leftOf3 !== '[_]'

    return isATSlotCorner
  }

  static getTSlotCorners_south(tetriminoCoordsOnPlayfield, playfield) {
    const isATSlotCorner = {}
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino2 = tetriminoCoordsOnPlayfield[2]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]   
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]

    const up1From2 = playfield[mino2[0] - 1] ? playfield[mino2[0] - 1][mino2[1]] : undefined 
    const up1From0 = playfield[mino0[0] - 1] ? playfield[mino0[0] - 1][mino0[1]] : undefined

    console.log(
      leftOf3,
      rightOf3,
      up1From2,
      up1From0
    )
    
    isATSlotCorner.a = rightOf3 !== '[_]' 
    isATSlotCorner.b = leftOf3 !== '[_]'  
    isATSlotCorner.c = up1From2 !== '[_]' 
    isATSlotCorner.d = up1From0 !== '[_]' 

    return isATSlotCorner
  }

  static getTSlotCorners_west(tetriminoCoordsOnPlayfield, playfield) {
    const isATSlotCorner = {}
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]
    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]

    isATSlotCorner.a = leftOf3 !== '[_]' 
    isATSlotCorner.b = leftOf0 !== '[_]' 
    isATSlotCorner.c = rightOf3 !== '[_]' 
    isATSlotCorner.d = rightOf0 !== '[_]' 

    return isATSlotCorner
  }


  static getTSpinType(newOrientation, tetriminoCoordsOnPlayfield, playfield) {
    const tSlotCorners = TSpinCalculator[`getTSlotCorners_${newOrientation}`](tetriminoCoordsOnPlayfield, playfield)
    
    let performedTSpin = false
    let performedMiniTSpin = false
    
    const aAndBAreTSlotCorners = tSlotCorners.a && tSlotCorners.b
    const cAndDAreTSlotCorners = tSlotCorners.c && tSlotCorners.d

    // Check for a T-Spin
    if (aAndBAreTSlotCorners && tSlotCorners.c || aAndBAreTSlotCorners && tSlotCorners.d) {
      performedTSpin = true
    }
    // Check for a mini T-Spin
    if (cAndDAreTSlotCorners && tSlotCorners.a || aAndBAreTSlotCorners && tSlotCorners.b) {
      performedMiniTSpin = true
    }
    
    console.log({
      performedTSpin,
      performedMiniTSpin
    })

    return {
      performedTSpin,
      performedMiniTSpin
    }

  }
}