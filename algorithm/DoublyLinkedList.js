class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  /**
   * 리스트의 맨 앞에 노드 추가
   * @param {*} value - 추가할 값
   */
  addToHead(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.size = 1;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
    this.size += 1;
  }

  /**
   * 리스트의 맨 뒤에 노드 추가
   * @param {*} value - 추가할 값
   */
  addToTail(value) {
    const newNode = new Node(value);

    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      this.size = 1;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
    this.size += 1;
  }

  /**
   * 특정 값을 가진 노드 찾기
   * @param {*} value - 찾을 값
   * @return {Node|null} - 찾은 노드 또는 null
   */
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

  /**
   * 특정 값 다음에 새로운 노드 삽입
   * @param {*} targetValue - 기준이 될 값
   * @param {*} newValue - 삽입할 새로운 값
   * @return {boolean} - 성공 여부
   */
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (targetNode === null) {
      return false;
    }

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next !== null) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
    this.size += 1;

    return true;
  }

  /**
   * 특정 값을 가진 노드 제거
   * @param {*} value - 제거할 값
   * @return {boolean} - 성공 여부
   */
  removeNode(value) {
    const node = this.findNode(value);

    if (node === null) {
      return false;
    }

    if (node === this.head) {
      this.head = node.next;
      if (this.head !== null) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
    } else if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail !== null) {
        this.tail.next = null;
      }
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }

    this.size -= 1;
    return true;
  }
}

const dll = new DoublyLinkedList();

dll.addToTail(1);
dll.addToTail(2);
dll.addToTail(3);
dll.addToTail(4);
dll.addToTail(5);
dll.addToHead(0);

console.log(dll.findNode(2).data);
console.log(dll.findNode(6));

dll.insertAfter(2, 2);
dll.removeNode(0);

// 출력 - 앞에서부터
const resultForward = [];
let current = dll.head;
while (current) {
  resultForward.push(current.data);
  current = current.next;
}

// 출력 - 뒤에서부터
const resultBackward = [];
current = dll.tail;
while (current) {
  resultBackward.push(current.data);
  current = current.prev;
}

console.log(resultForward); // [1, 2, 2, 3, 4, 5]
console.log(resultBackward); // [5, 4, 3, 2, 2, 1]
console.log(dll.size); // 6

export { Node, DoublyLinkedList };
