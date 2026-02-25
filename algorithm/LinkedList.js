class SingleNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addNode(value) {
    const newNode = new SingleNode(value)

    if (this.size === 0) {
      this.head = newNode
      this.tail = newNode
      this.size++
      return
    }

    this.tail.next = newNode
    this.tail = newNode
    this.size++
  }

  findNode(value) {
    let currentNode = this.head;

    while (currentNode) {
      if (currentNode.data === value) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode) return null;

    const newNode = new SingleNode(newValue);


    if (targetNode === this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
      this.size++;
      return;
    }

    newNode.next = targetNode.next;
    targetNode.next = newNode;
    this.size++;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue)

    if (!targetNode) return null;
    
    if (!targetNode.next) return null;

    if (targetNode.next == this.tail) {
      this.tail = targetNode;
      targetNode.next = null;
      this.size--;
      return;
    }

    targetNode.next = targetNode.next.next
    this.size--;
  }
}