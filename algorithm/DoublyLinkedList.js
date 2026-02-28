class DoublyNode {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addToHead(value) {
    const newNode = new DoublyNode(value);

    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.size++;
      return;
    }

    newNode.next = this.head
    this.head.prev = newNode;
    this.head = newNode;
    this.size++;
  }

  addToTail(value) {
    const newNode = new DoublyNode(value);

    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.size++;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
    this.size++;
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

    const newNode = new DoublyNode(newValue);

    if (targetNode === this.tail) {
      targetNode.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
      this.size++;
      return;
    }

    newNode.prev = targetNode;
    newNode.next = targetNode.next;
    targetNode.next.prev = newNode;
    targetNode.next = newNode;
    this.size++;
  }

  removeNode(value) {
    const targetNode = this.findNode(value);

    if (!targetNode) return null;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
      this.size--;
      return;
    }

    if (targetNode === this.head) {
      this.head = this.head.next;
      this.head.prev = null;
      this.size--;
      return;
    }

    if (targetNode === this.tail) {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.size--;
      return;
    }

    targetNode.prev.next = targetNode.next;
    targetNode.next.prev = targetNode.prev;
    this.size--;
  }
}