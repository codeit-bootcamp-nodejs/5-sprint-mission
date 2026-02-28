class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) return null;

    const value = this.items[this.head];
    this.head++;
    return value;
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.head];
  }

  isEmpty() {
    return this.head >= this.items.length;
  }
}