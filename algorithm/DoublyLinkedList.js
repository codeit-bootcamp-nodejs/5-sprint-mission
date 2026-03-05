class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  addToHead(value) {
    const newNode = new Node(value)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      const currentNode = this.head
      newNode.next = currentNode
      currentNode.prev = newNode
      this.head = newNode
    }
    this.length++
  }

  addToTail(value) {
    const newNode = new Node(value)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      const currentNode = this.tail
      newNode.prev = currentNode
      currentNode.next = newNode
      this.tail = newNode
    }
    this.length++
  }

  findNode(value) {
    let currentNode = this.head
    while (currentNode !== null) {
      if (currentNode.value === value) {
        return currentNode
      } else {
        currentNode = currentNode.next
      }
    }
    return null
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue)
    if (targetNode === null) {
      return null
    }
    if (targetNode === this.tail) {
      this.addToTail(newValue)
      return
    } else {
      const newNode = new Node(newValue)
      const afterNode = targetNode.next
      afterNode.prev = newNode
      targetNode.next = newNode
      newNode.prev = targetNode
      newNode.next = afterNode
    }
    this.length++
  }

  removeNode(value) {
    const targetNode = this.findNode(value)
    if (targetNode === null) {
      return null
    }

    if (targetNode === this.head && targetNode === this.tail) {
      this.head = null
      this.tail = null
    } else if (targetNode === this.head) {
      this.head = targetNode.next
      this.head.prev = null
    } else if (targetNode === this.tail) {
      this.tail = targetNode.prev
      this.tail.next = null
    } else {
      const prevNode = targetNode.prev
      const nextNode = targetNode.next
      prevNode.next = nextNode
      nextNode.prev = prevNode
    }
    this.length--
  }
}

// 테스트
const dll = new DoublyLinkedList()
dll.addToHead(3)
dll.addToHead(2)
dll.addToHead(1)
dll.addToTail(4)
dll.addToTail(5)
dll.addToTail(6)
console.log(dll)
console.log("----------")
console.log(dll.findNode(3))
console.log("----------")
dll.insertAfter(3, 7)
console.log(dll.findNode(3))
console.log("----------")
console.log(dll.findNode(7))
console.log("----------")
dll.removeNode(7)
console.log(dll.findNode(7))
