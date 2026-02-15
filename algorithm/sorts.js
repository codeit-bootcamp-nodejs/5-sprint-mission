// 1.선택 정렬(Selection Sort)
function selectionSort(arr) {
  const size = arr.length;

  for (let i = 0; i < size - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < size; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}


// 삽입 정렬(Insertion Sort)
function insertionSort(arr) {
  const size = arr.length;

  for (let i = 1; i < size; i++) {
    let j = i - 1;

    while (j >= 0 && arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      j--;
    }
  }
}


// 2.병합 정렬(Merge Sort)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}


// 3.퀵 정렬(Quick Sort)
function quickSort(arr) {

  function sort(left, right) {
    if (left >= right) return;

    const pivotIndex = partition(left, right);
    sort(left, pivotIndex - 1);
    sort(pivotIndex + 1, right);
  }

  function partition(left, right) {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  }

  sort(0, arr.length - 1);
}
