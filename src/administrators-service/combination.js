function flatDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatDeep(val)) : acc.concat(val), []);
};

const combination = async (item, current = "") => {
  if (item == null) return;
  const completed = `${current}${current ? "." : ""}${item.x}`;

  const next = [];
  if (item.l) next.push(combination(item.l, completed));
  if (item.r) next.push(combination(item.r, completed));

  if (next.length === 0) {
    return completed;
  }

  const res = flatDeep((await Promise.all(next)));

  return res;
};

module.exports = combination
