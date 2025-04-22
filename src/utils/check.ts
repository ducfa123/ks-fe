const isValuable = (value: any) => {
  if (value === null || value === undefined) {
    return false;
  } else {
    return true;
  }
};
const isValuableString = value => {
  return typeof value == "string" && value?.trim()?.length != 0;
};
const checkEmptyObj = (obj): boolean => {
  let isEmpty = true;
  if (!obj) {
    isEmpty = true;
    return isEmpty;
  }
  if (Object.keys(obj).length === 0) {
    isEmpty = true;
  } else {
    for (var prop in obj) {
      if (obj[prop]) {
        isEmpty = false;
      }
    }
  }
  return isEmpty;
};
const toArray = (data: any) => {
  if (Array.isArray(data)) {
    return data;
  } else {
    return [];
  }
};
export {isValuable, checkEmptyObj, isValuableString, toArray};
