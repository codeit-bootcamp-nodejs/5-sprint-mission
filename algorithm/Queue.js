class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) { this.items.push(value); }
  dequeue() { return this.isEmpty() ? null : this.items.shift(); }
  peek() { return this.isEmpty() ? null : this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}