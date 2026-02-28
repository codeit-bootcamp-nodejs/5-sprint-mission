function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
}

function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];

    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);

  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);

    quickSort(arr, low, pivotIndex - 1);

    quickSort(arr, pivotIndex + 1, high);
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];

  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

  return i + 1;
}

function heapify(arr, i, size) {
  let largest = i
  const left = i * 2 + 1
  const right = i * 2 + 2

  if (left < size && arr[left] > arr[largest]) largest = left
  if (right < size && arr[right] > arr[largest]) largest = right

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]]
    heapify(arr, largest, size)
  }
}

function heapsort(arr) {
  const n = arr.length

  for (let i = n - 1; i >= 0; i--) {
    heapify(arr, i, n)
  }

  for (let j = n - 1; j > 0; j--) {
    [arr[0], arr[j]] = [arr[j], arr[0]]
    heapify(arr, 0, j)
  }
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++; 
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; 
}

//테스트
const testArr1 = [64, 25, 12, 22, 11];
const testArr2 = [64, 25, 12, 22, 11, 90, 88, 45];
const testArr3 = [15, 5, 12, 14, 9, 10, 6, 999, 11, 1]
selectionSort(testArr1);
console.log(testArr1)

insertionSort(testArr1)
console.log(testArr1)

mergeSort(testArr2)

quickSort(testArr1)
console.log(testArr1)

heapsort(testArr3)
console.log(testArr3)
