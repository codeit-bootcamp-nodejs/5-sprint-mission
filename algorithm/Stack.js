class Stack {
  constructor() {
    this.stack = []
  }

  push(value) {
    this.stack.push(value)
  }

  pop() {
    return this.stack.pop()
  }

  peek() {
    return this.stack[this.stack.length - 1]
  }

  isEmpty() {
    return this.stack.length === 0
  }
}

// 테스트
const stack = new Stack()
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack)
console.log(stack.peek())
console.log(stack)
console.log(stack.pop())
console.log(stack)
console.log(stack.isEmpty())
console.log(stack.pop())
console.log(stack.pop())
console.log(stack.pop())
console.log(stack.isEmpty())
