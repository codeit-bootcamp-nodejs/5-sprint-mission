class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let currentNode = this.root;

    while (true) {
      if (value < currentNode.value) {
        if (!currentNode.left) {
          currentNode.left = newNode;
          newNode.parent = currentNode;
          return
        }

        currentNode = currentNode.left;
      } else {
        if (!currentNode.right) {
          currentNode.right = newNode;
          newNode.parent = currentNode;
          return
        }

        currentNode = currentNode.right;
      }
    }
  }

  find(value) {
    let currentNode = this.root;

    while (currentNode) {
      if (value === currentNode.value) return currentNode;

      if (value < currentNode.value) {
        currentNode = currentNode.left
      } else {
        currentNode = currentNode.right
      }
    }

    return null;
  }

  remove(value) {
    const targetNode = this.find(value);

    if (!targetNode) return null;

    // 자식이 없는 경우
    if (!targetNode.left && !targetNode.right) {
      if (!targetNode.parent) {
        this.root = null;
      } else if (targetNode.parent.left === targetNode) {
        targetNode.parent.left = null;
      } else {
        targetNode.parent.right = null;
      }
    }

    // 자식이 하나만 있는 경우
    else if (!targetNode.left || !targetNode.right) {
      const child = targetNode.left ? targetNode.left : targetNode.right;

      if (!targetNode.parent) {
        this.root = child;
      } else if (targetNode.parent.left === targetNode) {
        targetNode.parent.left = child;
      } else {
        targetNode.parent.right = child;
      }

      child.parent = targetNode.parent;
    }

    // 자식이 둘 다 있을 때
    else {
      let minRightNode = targetNode.right;
      while (minRightNode.left) {
        minRightNode = minRightNode.left
      }

      targetNode.value = minRightNode.value;

      
      if (minRightNode.parent.left === minRightNode) { // minRightNode가 왼쪽에 있을 때 minRightNode의 오른쪽 자식을 부모의 왼쪽에 채우거나 null로 잡는다.
        minRightNode.parent.left = minRightNode.right;
      } else { // minRightNode가 오른쪽에 있을 때 minRightNode의 오른쪽 자식을 부모의 오른쪽에 채우거나 null로 잡는다.
        minRightNode.parent.right = minRightNode.right;
      }

      if (minRightNode.right){
        minRightNode.right.parent = minRightNode.parent
      }
    }
  }
}