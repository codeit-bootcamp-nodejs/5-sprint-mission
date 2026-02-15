export class Stack {
  constructor(){
    this.list = [];
  }

  push(value) {
    this.list.push(value)
  }

  pop(){
    return this.list.pop();
  }

  peek(){
    return this.list[this.list.length - 1]
  }

  isEmpty(){
    return this.list.length === 0;
  }
}

//테스트
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.list)

console.log(stack.pop())
console.log(stack.peek())
console.log(stack.isEmpty())
