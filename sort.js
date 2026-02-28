// 선택 정렬 (Selection Sort) - 배열을 직접 수정
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
}

// 삽입 정렬 (Insertion Sort) - 배열을 직접 수정
function insertionSort(arr) {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = key;
    }
}

// 병합 정렬 (Merge Sort) - 새로운 배열 반환
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

    return result
        .concat(left.slice(i))
        .concat(right.slice(j));
}

// 퀵 정렬 (Quick Sort) - 배열을 직접 수정
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;

    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
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


// Selection Sort (in-place)
const nums1 = [3, 1, 2];
console.log('Before selectionSort:', nums1);
selectionSort(nums1);
console.log('After selectionSort:', nums1); // [1, 2, 3]

// Insertion Sort (in-place)
const nums2 = [5, 4, 3, 2, 1];
console.log('\nBefore insertionSort:', nums2);
insertionSort(nums2);
console.log('After insertionSort:', nums2); // [1, 2, 3, 4, 5]

// Merge Sort (returns new array)
const nums3 = [10, -1, 7, 3];
console.log('\nBefore mergeSort:', nums3);
const sorted3 = mergeSort(nums3);
console.log('After mergeSort (new array):', sorted3); // [-1, 3, 7, 10]
console.log('Original array unchanged:', nums3);

// Quick Sort (in-place)
const nums4 = [8, 2, 6, 4, 1];
console.log('\nBefore quickSort:', nums4);
quickSort(nums4);
console.log('After quickSort:', nums4); // [1, 2, 4, 6, 8]
