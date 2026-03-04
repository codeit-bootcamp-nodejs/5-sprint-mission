export class Queue {
  constructor(){
    this.list = [];
  }

  enqueue(value){
    this.list.push(value);
  }

  dequeue(){
    return this.list.shift()
  }

  peek(){
    return this.list[0]
  }

  isEmpty(){
    return this.list === 0;
  }
}

//테스트
const queue = new Queue;
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.list)

console.log(queue.dequeue())
console.log(queue.peek())
console.log(queue.isEmpty())