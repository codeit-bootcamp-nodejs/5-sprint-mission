
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  push(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size += 1;
  }

  pop() {
    if (this.head === null) {
      return null;
    }

    const removedData = this.head.data;
    this.head = this.head.next;
    this.size -= 1;

    return removedData;
  }


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

const stack = new Stack();

console.log(stack.isEmpty()); // true

stack.push(1);
stack.push(2);
stack.push(3);
stack.push(4);

console.log(stack.peek()); // 4
console.log(stack.pop()); // 4
console.log(stack.pop()); // 3
console.log(stack.pop()); // 2
console.log(stack.pop()); // 1


console.log(stack.isEmpty()); // true

console.log(stack.peek()); // null

export { Node, Stack };
