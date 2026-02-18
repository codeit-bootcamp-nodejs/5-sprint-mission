// 선택 정렬

function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
    }
  }
}


// 삽입 정렬

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

// 병합 정렬

function mergeSort(arr) {
  const n = arr.length;
  if (n <= 1) return arr.slice(); 

  const mid = Math.floor(n / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);

  function merge(a, b) {
    const result = [];
    let i = 0, j = 0;

    while (i < a.length && j < b.length) {
      if (a[i] <= b[j]) result.push(a[i++]);
      else result.push(b[j++]);
    }
    while (i < a.length) result.push(a[i++]);
    while (j < b.length) result.push(b[j++]);

    return result;
  }
}

// 퀵 정렬

function quickSort(arr) {
  quickSortRange(arr, 0, arr.length - 1);

  function quickSortRange(a, lo, hi) {
    if (lo >= hi) return;

    const p = partition(a, lo, hi);
    quickSortRange(a, lo, p - 1);
    quickSortRange(a, p + 1, hi);
  }

  function partition(a, lo, hi) {
    const pivot = a[hi];
    let i = lo;

    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        swap(a, i, j);
        i++;
      }
    }
    swap(a, i, hi);
    return i;
  }

  function swap(a, i, j) {
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
}

// 테스트

const nums1 = [3, 1, 2];
selectionSort(nums1);
console.log(nums1); 

const nums2 = [5, 2, 4, 6, 1, 3];
insertionSort(nums2);
console.log(nums2); 

const nums3 = [10, -1, 2, 5, 0, 6, 4, -5];
const sorted3 = mergeSort(nums3);
console.log(nums3);  
console.log(sorted3); 

const nums4 = [3, 7, 8, 5, 2, 1, 9, 5, 4];
quickSort(nums4);
console.log(nums4); 
