export function copy(obj) {
  let newObj = obj instanceof Array ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    newObj[k] = typeof v === "object" ? copy(v) : v;
  }
  return newObj;
}
