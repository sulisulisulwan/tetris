import BasePhase from "./BasePhase.js";
import { NextQueue } from '../../next-queue/NextQueue.js'
import { TetriminoFactory } from '../../tetriminos/TetriminoFactory.js'

export default class Generation extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
    this.nextQueue = new NextQueue()
  }

  execute(appState, setAppState) {
    // console.log('>>> GENERATION PHASE')
    this.syncToLocalState(appState)

    // Dequeue a new tetrimino and instantiate it.
    const tetriminoContext = this.nextQueueHandler.dequeue()
    const nextQueueData = this.nextQueueHandler.queueToArray(5)
    const newTetrimino = TetriminoFactory.getTetrimino(tetriminoContext)
    
    
    // Place dequeued tetrimino in playField
    const playField = this.localState.playField
    const startingOrientationCoords = newTetrimino.orientations[newTetrimino.currentOrientation].coordsOffOrigin

    startingOrientationCoords.forEach(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
      playField[startingVertical + vertical][startingHorizontal + horizontal] = newTetrimino.minoGraphic
    })

    // Update swap status in case hold queue has been used
    let { swapStatus } = appState.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    setAppState(prevState => ({ 
      nextQueueData,
      playField,
      currentTetrimino: newTetrimino,
      currentGamePhase: 'falling',
      holdQueue: {
        ...prevState.holdQueue,
        swapStatus
      }
    }))
  }

}