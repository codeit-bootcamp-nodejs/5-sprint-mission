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

function insertionSort(arr) {
  const size = arr.length;

  for (let i = 1; i < size; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      } else {
        break;
      }
    }
  }
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr) {

  function sort(left, right) {
    if (left >= right) return;

    const pivotIndex = partition(arr, left, right);
    sort(left, pivotIndex - 1);
    sort(pivotIndex + 1, right);
  }

  function partition(arr, left, right) {
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

// 테스트용 배열
const original = [5, 3, 8, 4, 2, 7, 1, 6];

console.log("원본 배열:", original);

const arr1 = [...original];
selectionSort(arr1);
console.log("Selection Sort:", arr1);

const arr2 = [...original];
insertionSort(arr2);
console.log("Insertion Sort:", arr2);

const arr3 = [...original];
const sorted = mergeSort(arr3);
console.log("Merge Sort:", sorted);

const arr4 = [...original];
quickSort(arr4);
console.log("Quick Sort:", arr4);
