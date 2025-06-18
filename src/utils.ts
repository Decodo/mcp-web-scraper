export const removeKeyFromNestedObject = ({
  obj,
  keyToRemove,
}: {
  obj: object;
  keyToRemove: string;
}): object => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeKeyFromNestedObject({ obj: item, keyToRemove }));
  }

  const newObj = {};

  for (const key in obj) {
    if (key === keyToRemove) {
      continue;
    }

    newObj[key] = removeKeyFromNestedObject({ obj: obj[key], keyToRemove });
  }

  return newObj;
};
