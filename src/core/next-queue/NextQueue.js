import { VirtualBag } from './VirtualBag.js'
import { QueueList } from './QueueList.js'
import { TetriminoFactory } from '../tetriminos/TetriminoFactory.js'
export class NextQueue {

  constructor() {
    this.virtualBag = new VirtualBag()
    this.queue = this.initiateQueue()
  }

  initiateQueue() {

    const queue = new QueueList()
    const startingBag = new VirtualBag()
    const bagLength = startingBag.getBagLength()
    for(let i = 0; i < bagLength; i += 1) {
      const tetrimino = startingBag.popTetriminoFromBag()
      queue.enqueueToList(tetrimino)
    }
    return queue

  }

  queueToArray(length) {
    return this.queue.queueToArray(length)
  }

  dequeue() {

    if (this.virtualBag.getBagLength() === 0) {
      this.virtualBag.fillBag()
    }
    const tetrimino = this.virtualBag.popTetriminoFromBag()
    this.queue.enqueueToList(tetrimino)
    const context = this.queue.dequeueFromList().tetrimino
    const newTetrimino = TetriminoFactory[`get${context}`]()
    return newTetrimino
  }

  peek() {
    return this.queue.head
  }

  logQueue() {
    this.queue.logQueue()
  }

}