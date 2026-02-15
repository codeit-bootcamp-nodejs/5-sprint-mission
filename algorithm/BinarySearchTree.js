export class Node {
  constructor(data) {
    this.data = data
    this.left = null
    this.right = null
  }
}

export class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(value) {
    const node = new Node(value)

    if (this.root === null) {
      this.root = node
    }

    let current = this.root
    while (true) {
      if (current.data > value) {
        if (!current.left) {
          current.left = node
          break
        }
        current = current.left
      } else if (current.data < value) {
        if (!current.right) {
          current.right = node
          break
        }
        current = current.right
      } else if (current.data === value) {
        return;
      }
    }
  }

  find(value) {
    let current = this.root
    while (true) {
      if (!current) {
        return null;
      }
      if (current.data === value) {
        return current.data
      } else if (current.data > value) {
        current = current.left
      } else {
        current = current.right
      }
    }
  }

 remove(value) {
  let current = this.root
  let parent = null

  while (current && current.data !== value) {
    parent = current
    if (value < current.data) {
      current = current.left
    } else {
      current = current.right
    }
  }

  if (!current) return false

  if (current.left && current.right) {
    let newOneParent = current
    let newOne = current.right
    while (newOne.left) {
      newOneParent = newOne
      newOne = newOne.left
    }
    current.data = newOne.data

    current = newOne
    parent = newOneParent
  }

  const child = current.left ? current.left : current.right

  if (!parent) {
    this.root = child
  } else if (parent.left === current) {
    parent.left = child
  } else {
    parent.right = child
  }
}
  // 확인용
  inorder(node = this.root) {
    if (node != null) {
      this.inorder(node.left)
      console.log(node.data)
      this.inorder(node.right)
    }
  }
  print() {
    this.inorder(this.root)
  }
}

// 테스트
const tree = new BinarySearchTree

tree.insert(1)
tree.insert(7)
tree.insert(3)
tree.insert(9)

tree.print()
console.log('=================')
console.log(tree.find(9))
console.log('=================')
tree.remove(9)
tree.print()