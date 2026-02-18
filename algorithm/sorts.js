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

  return arr;
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

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

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function quickSort(arr) {
  return quickSortHelper(arr, 0, arr.length - 1);
}

function quickSortHelper(arr, low, high) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);

    quickSortHelper(arr, low, pivotIndex - 1);

    quickSortHelper(arr, pivotIndex + 1, high);
  }

  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

if (require.main === module) {
  const testData1 = [6, 3, 2, 1, 5];

  console.log("Selection sort");
  const test1 = [...testData1];
  console.log(test1);
  selectionSort(test1);
  console.log(test1);
  console.log("");

  console.log("Insertion sort");
  const test2 = [...testData1];
  console.log(test2);
  insertionSort(test2);
  console.log(test2);
  console.log("");

  console.log("Merge sort");
  const test3 = [...testData1];
  console.log(test3);
  const sorted3 = mergeSort(test3);
  console.log(sorted3);
  console.log("");

  console.log("Quick sort");
  const test4 = [...testData1];
  console.log(test4);
  quickSort(test4);
  console.log(test4);
}
