class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
    this.tail = null;
  }

  addNode(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.size = 1;
      return;
    }

    this.tail.next = newNode;
    this.tail = newNode;
    this.size += 1;
  }

  findNode(value) {
    let current = this.head;

    while (current !== null) {
      if (current.data === value) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null) {
      return false;
    }

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;
    this.size += 1;

    if (newNode.next === null) {
      this.tail = newNode;
    }

    return true;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null || targetNode.next === null) {
      return null;
    }

    const removedData = targetNode.next.data;
    targetNode.next = targetNode.next.next;
    this.size -= 1;

    if (targetNode.next === null) {
      this.tail = targetNode;
    }

    return removedData;
  }
}

const arr = new LinkedList();

arr.addNode(1);
arr.addNode(2);
arr.addNode(3);

console.log(arr.findNode(1).data); // 1
console.log(arr.findNode(2).data); // 2
console.log(arr.findNode(3).data); // 3
console.log(arr.findNode(4)); // null

arr.insertAfter(2, 2.5);

arr.removeAfter(1);

const result = [];
let current = arr.head;
while (current) {
  result.push(current.data);
  current = current.next;
}

console.log(result); // [1, 2.5, 3]
console.log(arr.size); // 3

export { Node, LinkedList };
