export class Node {
  constructor(data) {
    this.data = data
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addNode(value) {
    const node = new Node(value);
    if(!this.head) {
      this.head = this.tail = node;
    }
    this.tail.next = node;
    this.tail = node;
  }

  findNode(value) {
    let current = this.head;
    while(current) {
      if (current.data === value) {
        return current;
      }
      current = current.next;
    }
  }

  insertAfter(targetValue, newValue) {
    const node = new Node(newValue);
    const current = this.findNode(targetValue)
    node.next = current.next
    current.next = node

    if(this.tail === current) this.tail = node;
    return current.next
  }

  removeAfter(targetValue) {
    const current = this.findNode(targetValue)
    if (!current || !current.next) return null;

    const removed = current.next
    current.next = removed.next
    
    if (removed.next === this.tail) {
      this.tail = current;
    }

    removed.next = null;
    return removed
  }
}

const linkedList = new LinkedList;

linkedList.addNode(1)
linkedList.addNode(2)
linkedList.addNode(3)

console.log(linkedList.findNode(1))
console.log(linkedList.findNode(2))
console.log(linkedList.findNode(3))

console.log(linkedList.insertAfter(1, 5))
console.log(linkedList.removeAfter(5))
