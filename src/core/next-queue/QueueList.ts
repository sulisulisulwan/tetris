class QueueNode {

  public tetrimino: string
  public next: QueueNode | null
  public prev: QueueNode | null

  constructor(tetrimino: string) {
    this.tetrimino = tetrimino
    this.next = null
    this.prev = null
  }
}

export class QueueList {

  private head: QueueNode
  private tail: QueueNode
  private length: number

  constructor() {
    this.head = new QueueNode(null)
    this.tail = new QueueNode(null)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.length = 0
  }

  public enqueueToList(tetrimino: string): void {

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

  public dequeueFromList(): QueueNode {

    if (this.head.next.tetrimino === null) {
      return null
    }

    const dequeued = this.head.next
    this.head = this.head.next
    this.length -= 1
    return dequeued

  }

  public queueToArray(length: number): string[] {

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

  public logQueue(length: number): void {
    const queue = this.queueToArray(length)
    console.log(
      'QUEUE: ', queue,
      'queueLength: ', this.getLength()
    )
  }

  public getLength(): number {
    return this.length
  }

  public peek() {
    return this.head
  }

}