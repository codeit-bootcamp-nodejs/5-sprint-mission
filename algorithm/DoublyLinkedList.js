export class Node {
  constructor(data) {
    this.data = data
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    }
    node.next = this.head
    this.head.prev = node
    this.head = node
  }

  addToTail(value) {
    const node = new Node(value);
    if (!this.tail) {
      this.head = this.tail = node;
    }
    node.prev = this.tail
    this.tail.next = node
    this.tail = node
  }

  findNode(value) {
    let current = this.head
    while (current) {
      if (current.data === value) {
        return current;
      }
      current = current.next
    }
  }

  insertAfter(targetValue, newValue) {
    const target = this.findNode(targetValue)
    if (!target) return null

    const node = new Node(newValue)
    node.prev = target
    node.next = target.next

    if (target.next) {
      target.next.prev = node
    } else {
      this.tail = node;
    }

    target.next = node;
    return node
  }

  removeNode(targetValue) {
    const target = this.findNode(targetValue)
    if (!target || !target.next) return null

    const removed = target.next
    target.next = removed.next

    if (removed.next) {
      removed.next.prev = target;
    } else {
      this.tail = target;
    }

    removed.prev = null;
    removed.next = null;
    return removed;
  }
}

const doubly = new DoublyLinkedList
doubly.addToHead(1)
doubly.addToHead(-1)
doubly.addToHead(-2)
doubly.addToTail(2)
doubly.addToTail(3)

console.log(doubly.findNode(-2))
console.log(doubly.insertAfter(2, 5))
console.log(doubly.removeNode(1))