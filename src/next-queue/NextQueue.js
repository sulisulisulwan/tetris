import { VirtualBag } from './VirtualBag.js'

class QueueNode {
  constructor(tetrimino) {
    this.tetrimino = tetrimino
    this.next = null
    this.prev = null
  }
}

class QueueList {
  constructor() {
    this.head = new QueueNode(null)
    this.tail = new QueueNode(null)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.length = 0
  }

  enqueueToList(tetrimino) {

    let node = new QueueNode(tetrimino)

    if (this.head.next.tetrimino === null) {
      this.head.next = node
      node.next = this.tail
      this.tail.prev = node
      this.length += 1
      return
    }
    
    node.prev = this.tail.prev
    this.tail.prev.next = node

    node.next = this.tail
    this.tail.prev = node
    this.length += 1
  }

  dequeueFromList() {

    if (this.head.next.tetrimino === null) {
      return null
    }

    const dequeued = this.head.next
    this.head = this.head.next
    this.length -= 1
    return dequeued

  }

  queueToArray(length) {

    let counter = Infinity
    if (length) {
      counter = length
    }

    const queue = []
    let curr = this.head.next !== null ? this.head.next : this.head

    while (curr.next !== null) {
      if (!counter) {
        break
      }
      queue.push(curr.tetrimino)
      curr = curr.next
      counter -= 1
    }

    return queue
  }

  logQueue(length) {
    
    const queue = this.queueToArray(length)

    console.log(
      'QUEUE: ', queue,
      'queueLength: ', this.getLength()
    )

  }

  getLength() {
    return this.length
  }

}

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
    return this.queue.dequeueFromList().tetrimino
  }

  peek() {
    return this.queue.head
  }

  logQueue() {
    this.queue.logQueue()
  }

}