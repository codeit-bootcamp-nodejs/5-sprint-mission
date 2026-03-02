class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }
    this._insertRecursive(this.root, value);
  }

  _insertRecursive(node, value) {
    if (value < node.data) {
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this._insertRecursive(node.left, value);
      }
    } else {
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this._insertRecursive(node.right, value);
      }
    }
  }

  find(value) {
    return this._findRecursive(this.root, value);
  }

  _findRecursive(node, value) {
    if (node === null) {
      return null;
    }

    if (value === node.data) {
      return node;
    } else if (value < node.data) {
      return this._findRecursive(node.left, value);
    } else {
      return this._findRecursive(node.right, value);
    }
  }

  remove(value) {
    this.root = this._removeRecursive(this.root, value);
  }

  _removeRecursive(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.data) {
      node.left = this._removeRecursive(node.left, value);
    } else if (value > node.data) {
      node.right = this._removeRecursive(node.right, value);
    } else {
      if (node.left === null && node.right === null) {
        return null;
      }

      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      const successor = this._findMin(node.right);
      node.data = successor.data;
      node.right = this._removeRecursive(node.right, successor.data);
    }

    return node;
  }

  _findMin(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }
}


function inorderTraversal(node) {
  if (node === null) {
    return [];
  }
  return inorderTraversal(node.left)
    .concat([node.data])
    .concat(inorderTraversal(node.right));
}

const bst = new BinarySearchTree();

bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log(inorderTraversal(bst.root)); // [20, 30, 40, 50, 60, 70, 80]

console.log(bst.find(30) ? bst.find(30).data : null); // 30
console.log(bst.find(60) ? bst.find(60).data : null); // 60
console.log(bst.find(100)); // null

bst.remove(20);
console.log(inorderTraversal(bst.root)); // [30, 40, 50, 60, 70, 80]

bst.remove(30);
console.log(inorderTraversal(bst.root)); // [40, 50, 60, 70, 80]

bst.remove(50);
console.log(inorderTraversal(bst.root)); // [40, 60, 70, 80]

export { Node, BinarySearchTree };
