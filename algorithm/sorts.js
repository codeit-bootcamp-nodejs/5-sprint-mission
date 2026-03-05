// 선택 정렬 (Selection sort)
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
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}

// 선택 정렬 테스트
const data1 = [5, 3, 8, 4, 1];
selectionSort(data1);
console.log(data1);

// -------------

// 삽입 정렬 (Insertion sort)
function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let current = arr[i];
    
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }

  return arr;
}

// 삽입 정렬 테스트
const data2 = [5, 3, 8, 4, 1];
insertionSort(data2);
console.log(data2);

// -------------

// 병합 정렬 (Merge sort)
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
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

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

// 병합 정렬 테스트
const data3 = [5, 3, 8, 4, 1];
const sortedData3 = mergeSort(data3);
console.log(sortedData3);
console.log(data3);

// -------------

// 퀵 정렬 (Quick sort)
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) {
    return;
  }

  const pivotIndex = partition(arr, left, right);

  quickSort(arr, left, pivotIndex - 1);
  
  quickSort(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr, left, right) {
  const pivotValue = arr[left]; 
  let i = left + 1;
  let j = right;

  while (i <= j) {
    while (i <= right && arr[i] < pivotValue) {
      i++;
    }
    while (j >= left + 1 && arr[j] > pivotValue) {
      j--;
    }

    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }

  [arr[left], arr[j]] = [arr[j], arr[left]];
  
  return j;
}

// 퀵 정렬 테스트
const data4 = [5, 3, 8, 4, 1];
quickSort(data4);
console.log(data4);

// -------------

// 힙 정렬 (Heap sort)
function heapSort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// 힙 정렬 테스트
const data5 = [5, 3, 8, 4, 1];
heapSort(data5);
console.log(data5);
