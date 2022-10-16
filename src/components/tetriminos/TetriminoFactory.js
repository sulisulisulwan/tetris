export class TetriminoFactory {

  constructor() {

  }

  static getBaseTetrimino() {
    return {
      startingGridPosition: [18, 2],
      currentGridPosition: [18, 2],
      localGridSize: 3,
      currentOrientation: 'north',
      status: 'inQueue'
    }
  }

  static getTetrimino(tetrimino) {
    const getContext = `get${tetrimino}`
    return TetriminoFactory[getContext]()
  }
  
  static getITetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[i]'
    tetrimino.startingGridPosition = [19, 3]
    tetrimino.currentGridPosition = [19, 3]
    tetrimino.localGridSize = 4
    tetrimino.orientations = {
      north: {
        primaryPosition: [[1,0], [1,1], [1,2], [1,3]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [1,3], 4: [1,0], 5: [1,3] }
      },
      east: {
        primaryPosition: [[0,2], [1,2], [2,2], [3,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [1,2], 4: [0,2], 5: [3,2] }      
      },
      south: {
        primaryPosition: [[2,0], [2,1], [2,2], [2,3]],
        rotationPoints: { 1: [1,1], 2: [1,3], 3: [1,0], 4: [2,2], 5: [2,0] }
      },
      west: {
        primaryPosition: [[0,1], [1,1], [2,1], [3,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [3,1], 5: [0,1] }
      }
    }  

    return tetrimino
  }

  static getOTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[o]',
    tetrimino.startingGridPosition = [18, 3],
    tetrimino.currentGridPosition = [18, 3],
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      south: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      }
    } 
    
    return tetrimino
  }

  static getJTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[j]'
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,0], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [0,2], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,0], [1,1], [1,2], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,1], [1,1], [2,0], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    }

    return tetrimino
  }

  static getLTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[l]'
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,2], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [1,1], [2,1], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,0], [1,1], [1,2], [2,0]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,0], [0,1], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    }

    return tetrimino
  }

  static getSTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[s]'
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,1], [0,2], [1,0], [1,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [1,1], [1,2], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,1], [1,2], [2,0], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,0], [1,0], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    }

    return tetrimino
  }

  static getZTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[z]'
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,0], [0,1], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,2], [1,1], [1,2], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,0], [1,1], [2,1], [2,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,1], [1,0], [1,1], [2,0]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    } 

    return tetrimino
  }

  static getTTetrimino() {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.minoGraphic = '[t]'
    tetrimino.orientations = {
      north: {
        primaryPosition: [[0,1], [1,0], [1,1], [1,2]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      east: {
        primaryPosition: [[0,1], [1,1], [1,2], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,2], 3: [2,2], 4: [-1,1], 5: [-1,2] }
      },
      south: {
        primaryPosition: [[1,0], [1,1], [1,2] , [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,1], 3: [1,1], 4: [1,1], 5: [1,1] }
      },
      west: {
        primaryPosition: [[0,1], [1,1], [1,1], [2,1]],
        rotationPoints: { 1: [1,1], 2: [1,0], 3: [2,0], 4: [-1,1], 5: [-1,0] }
      }
    } 

    return tetrimino
  }




}