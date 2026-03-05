
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  enqueue(value) {
    const newNode = new Node(value);

    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      this.size = 1;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    this.size += 1;
  }

  dequeue() {
    if (this.head === null) {
      return null;
    }

    const removedData = this.head.data;
    this.head = this.head.next;
    this.size -= 1;

    if (this.head === null) {
      this.tail = null;
    }

    return removedData;
  }

  /**
   * 큐의 앞 요소 확인 
   * @return {*} - 앞 요소의 값 또는 null
   */
  peek() {
    if (this.head === null) {
      return null;
    }
    return this.head.data;
  }

  isEmpty() {
    return this.size === 0;
  }
}

const queue = new Queue();

console.log(queue.isEmpty()); // true

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);

console.log(queue.peek()); // 1

console.log(queue.dequeue()); // 1
console.log(queue.dequeue()); // 2
console.log(queue.dequeue()); // 3
console.log(queue.dequeue()); // 4

console.log(queue.isEmpty()); // true

console.log(queue.peek()); // null

export { Node, Queue };
