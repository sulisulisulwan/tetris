export class TetriminoFactory {

  constructor() {

  }

  static getBaseTetrimino() {
    return {
      startingGridPosition: [18, 2],
      currentOriginOnPlayfield: [18, 2],
      localGridSize: 3,
      currentOrientation: 'north',
      status: 'inQueue'
    }
  }

  static getTetrimino(tetrimino) {
    console.log('in getTetrimino', tetrimino)
    return TetriminoFactory[`get${tetrimino}`]()
  }

  static resetTetrimino(tetrimino) {
    return TetriminoFactory.getTetrimino(tetrimino.name)
  }
  
  static getITetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'ITetrimino'
    tetrimino.minoGraphic = '[i]'
    tetrimino.startingGridPosition = [19, 3]
    tetrimino.currentOriginOnPlayfield = [19, 3]
    tetrimino.localGridSize = 4
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [1,3]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [1,3], 4: [1,0], 5: [1,3] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,2], [1,2], [2,2], [3,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [1,2], 4: [0,2], 5: [3,2] },
        lowestRowOffOrigin: 3      
      },
      south: {
        coordsOffOrigin: [[2,0], [2,1], [2,2], [2,3]],
        rotationPoints: { 1: [1,1], 2: [1,3], 3: [1,0], 4: [2,2], 5: [2,0] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,1], [2,1], [3,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [3,1], 5: [0,1] },
        lowestRowOffOrigin: 3
      }
    }  

    return tetrimino
  }

  static getOTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'OTetrimino'
    tetrimino.minoGraphic = '[o]',
    tetrimino.startingGridPosition = [18, 3],
    tetrimino.currentOriginOnPlayfield = [18, 3],
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      south: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      west: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      }
    } 
    
    return tetrimino
  }

  static getJTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'JTetrimino'
    tetrimino.minoGraphic = '[j]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,0], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,1], [2,0], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  static getLTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'LTetrimino'
    tetrimino.minoGraphic = '[l]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,2], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [2,1], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [2,0]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,0], [0,1], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  static getSTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'STetrimino'
    tetrimino.minoGraphic = '[s]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [0,2], [1,0], [1,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [1,2], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,1], [1,2], [2,0], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,0], [1,0], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  static getZTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'ZTetrimino'
    tetrimino.minoGraphic = '[z]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,0], [0,1], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,2], [1,1], [1,2], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [2,1], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [2,0]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] },
        lowestRowOffOrigin: 2
      }
    } 

    return tetrimino
  }

  static getTTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'TTetrimino'
    tetrimino.minoGraphic = '[t]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [1,2], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2] , [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] },
        lowestRowOffOrigin: 2
      }
    } 

    return tetrimino
  }

}