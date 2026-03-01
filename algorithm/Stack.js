class Stack {
  constructor() {
    this.items = [];
  }
  push(value) { this.items.push(value); }
  pop() { return this.isEmpty() ? null : this.items.pop(); }
  peek() { return this.isEmpty() ? null : this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}