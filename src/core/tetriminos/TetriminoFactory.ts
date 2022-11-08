import { tetriminoIF } from "./interfaces"


type factoryFuncs = {
  getITetrimino: Function,
  getOTetrimino: Function,
  getTTetrimino: Function,
  getJTetrimino: Function,
  getLTetrimino: Function,
  getSTetrimino: Function,
  getZTetrimino: Function
}


export class TetriminoFactory {


  private static factoryFunctions: factoryFuncs = {
    getITetrimino: TetriminoFactory.getITetrimino,
    getOTetrimino: TetriminoFactory.getITetrimino,
    getTTetrimino: TetriminoFactory.getITetrimino,
    getJTetrimino: TetriminoFactory.getITetrimino,
    getLTetrimino: TetriminoFactory.getITetrimino,
    getSTetrimino: TetriminoFactory.getITetrimino,
    getZTetrimino: TetriminoFactory.getITetrimino
  }

  private static getBaseTetrimino(): tetriminoIF {
    return {
      startingGridPosition: [18, 2],
      currentOriginOnPlayfield: [18, 2],
      localGridSize: 3,
      currentOrientation: 'north',
      status: 'inQueue'
    }
  }

  public static getTetrimino(tetrimino: string): tetriminoIF {
    const factoryFunc = `get${tetrimino}`

    return TetriminoFactory.factoryFunctions[factoryFunc as keyof factoryFuncs]()
  }

  public static resetTetrimino(tetrimino: tetriminoIF) {
    return TetriminoFactory.getTetrimino(tetrimino.name)
  }
  
  protected static getITetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'ITetrimino'
    tetrimino.minoGraphic = '[i]'
    tetrimino.startingGridPosition = [19, 3]
    tetrimino.currentOriginOnPlayfield = [19, 3]
    tetrimino.localGridSize = 4
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [1,3]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [1,3], '4': [1,0], '5': [1,3] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,2], [1,2], [2,2], [3,2]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [1,2], '4': [0,2], '5': [3,2] },
        lowestRowOffOrigin: 3      
      },
      south: {
        coordsOffOrigin: [[2,0], [2,1], [2,2], [2,3]],
        rotationPoints: { '1': [1,1], '2': [1,3], '3': [1,0], '4': [2,2], '5': [2,0] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,1], [2,1], [3,1]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [3,1], '5': [0,1] },
        lowestRowOffOrigin: 3
      }
    }  

    return tetrimino
  }

  protected static getOTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'OTetrimino'
    tetrimino.minoGraphic = '[o]',
    tetrimino.startingGridPosition = [18, 3],
    tetrimino.currentOriginOnPlayfield = [18, 3],
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      south: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      west: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      }
    } 
    
    return tetrimino
  }

  protected static getJTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'JTetrimino'
    tetrimino.minoGraphic = '[j]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,0], [1,0], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [0,2], [1,1], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [2,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,1], [2,0], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  protected static getLTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'LTetrimino'
    tetrimino.minoGraphic = '[l]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,2], [1,0], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [2,1], [2,2]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2], [2,0]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,0], [0,1], [1,1], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  protected static getSTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'STetrimino'
    tetrimino.minoGraphic = '[s]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [0,2], [1,0], [1,1]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [1,2], [2,2]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,1], [1,2], [2,0], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,0], [1,0], [1,1], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
        lowestRowOffOrigin: 2
      }
    }

    return tetrimino
  }

  protected static getZTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'ZTetrimino'
    tetrimino.minoGraphic = '[z]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,0], [0,1], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,2], [1,1], [1,2], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [2,1], [2,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [2,0]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
        lowestRowOffOrigin: 2
      }
    } 

    return tetrimino
  }

  protected static getTTetrimino(): tetriminoIF {
    const tetrimino = this.getBaseTetrimino()
    tetrimino.name = 'TTetrimino'
    tetrimino.minoGraphic = '[t]'
    tetrimino.orientations = {
      north: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [1,2]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 1
      },
      east: {
        coordsOffOrigin: [[0,1], [1,1], [1,2], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
        lowestRowOffOrigin: 2
      },
      south: {
        coordsOffOrigin: [[1,0], [1,1], [1,2] , [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
        lowestRowOffOrigin: 2
      },
      west: {
        coordsOffOrigin: [[0,1], [1,0], [1,1], [2,1]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
        lowestRowOffOrigin: 2
      }
    } 

    return tetrimino
  }

}