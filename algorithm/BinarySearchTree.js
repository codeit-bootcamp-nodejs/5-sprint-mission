class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.parent = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(value) {
    const newNode = new Node(value)
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          newNode.parent = current;
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          newNode.parent = current;
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  find(value) {
    if (!this.root) {
      return null;
    }
    let current = this.root;
    while (current) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current;
      }
    }
    return null;
  }

  remove(value) {
    const node = this.find(value);
    if (!node) {
      return null;
    }

    // 자식 Node가 없는 경우
    if (!node.left && !node.right) {
      if (node === this.root) {
        this.root = null;
      } else if (node === node.parent.left) {
        node.parent.left = null;
      } else {
        node.parent.right = null;
      }
    }
    // 자식 Node가 하나인 경우
    else if (!node.left || !node.right) {
      const child = node.left || node.right;
      if (node === this.root) {
        this.root = child;
        child.parent = null;
      } else if (node === node.parent.left) {
        node.parent.left = child;
        child.parent = node.parent;
      } else {
        node.parent.right = child;
        child.parent = node.parent;
      }
    }
    // 자식 Node가 두 개인 경우
    else {
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }
      node.value = successor.value;
      const child = successor.right;
      if (successor === successor.parent.left) {
        successor.parent.left = child;
      } else {
        successor.parent.right = child;
      }
      if (child) {
        child.parent = successor.parent;
      }
    }
    return this;
  }
}

const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(12);
bst.insert(18);
console.log(bst);
console.log("----------");
console.log(bst.find(5));
console.log("----------");
console.log(bst.find(6));
console.log("----------");
bst.remove(5);
console.log(bst);
