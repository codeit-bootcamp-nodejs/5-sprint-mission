class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  addNode(value) {
    const newNode = new Node(value)
    if (this.length === 0) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }
    this.length++
  }

  findNode(value) {
    if (this.length === 0) {
      return null
    }
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
      this.addNode(newValue)
      return
    } else {
      const newNode = new Node(newValue)
      newNode.next = targetNode.next
      targetNode.next = newNode
    }
    this.length++
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue)
    if (targetNode === null) {
      return null
    }
    if (targetNode === this.tail) {
      return null
    }
    const removedNode = targetNode.next
    targetNode.next = removedNode.next

    if (removedNode === this.tail) {
      this.tail = targetNode
    }

    this.length--
    return removedNode.value
  }
}

// 테스트
const linkedList = new LinkedList()
linkedList.addNode(1)
linkedList.addNode(2)
linkedList.addNode(3)
linkedList.addNode(4)
linkedList.addNode(5)
console.log(linkedList.findNode(3))
console.log("----------")
console.log(linkedList.findNode(4))
console.log("----------")
console.log(linkedList.insertAfter(3, 6))
console.log("----------")
console.log(linkedList.findNode(6))
console.log("----------")
console.log(linkedList.findNode(3))
console.log("----------")
console.log(linkedList.findNode(4))
console.log("----------")
console.log(linkedList.removeAfter(3))
console.log("----------")
console.log(linkedList.findNode(6))
console.log("----------")
console.log(linkedList)
