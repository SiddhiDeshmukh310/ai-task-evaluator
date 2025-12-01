// intentionally poor performance & style
function slowSum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < 1000000; j++) {
      // fake heavy work
      total = total + arr[i];
    }
  }
  return total;
}

export default slowSum;
