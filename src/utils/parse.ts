import dayjs from "dayjs";
import {formatTime} from "../types";

const formatDateToString = (
  date: Object | string | null,
  format: formatTime | string | null = null
) => {
  const validDate = dayjs(date?.toString())?.isValid();
  return date && validDate
    ? format
      ? format === formatTime.unix
        ? dayjs(date?.toString()).unix()
        : dayjs(date?.toString()).format(format as any)
      : dayjs(date?.toString()).format()
    : null;
};
const toNumber = (value, fixed = 0) => {
  return !isNaN(value) ? Number(Number(value).toFixed(fixed)) : 0;
};
const convertDateStringToDateObject = (
  dateString: string | null,
  unix = false
) => {
  const unixTimeSeconds =
    dateString?.toString()?.length == 13
      ? toNumber(dateString) / 1000
      : toNumber(dateString);

  return dateString && dayjs(dateString)?.isValid()
    ? unix
      ? dayjs.unix(toNumber(unixTimeSeconds))
      : dayjs(dateString)
    : null;
};
export const capitalizeFirstLetter = str => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const convertNumberDecimalToWords = (number, addonAfter = "") => {
  const firstBlock = toNumber(number?.toString()?.split(".")?.[0]);
  const secondBlockString = number?.toString()?.split(".")?.[1];
  const secondBlock = toNumber(secondBlockString);
  let secondBlockWords = secondBlockString
    ?.toString()
    .split("")
    .map(e => `${convertNumberToWords(e)} `)
    .join(" ");

  const words =
    `${convertNumberToWords(firstBlock)}` +
    `${toNumber(secondBlock) > 0 ? `phẩy ${secondBlockWords}` : ""}` +
    addonAfter;
  return words;
};
const convertNumberToWords = (number, addonAfter = "") => {
  const chuHangDonVi = [
    " ",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const chuHangChuc = [
    "lẻ",
    "mười",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const chuHangTram = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const dvBlock = [" ", " nghìn ", " triệu ", " tỷ "];

  function convertTwoBlock(number) {
    const dv_index = parseInt(number.charAt(1));
    let dv = chuHangDonVi[dv_index];
    const chuc = chuHangChuc[parseInt(number.charAt(0))];
    let append = " ";
    if (parseInt(number.charAt(0)) > 0 && parseInt(number.charAt(1)) === 5) {
      dv = "lăm";
    }
    if (parseInt(number.charAt(0)) > 1) {
      append = " mươi ";
      if (parseInt(number.charAt(1)) === 1) {
        dv = "mốt";
      }
    }
    return chuc + append + dv;
  }

  function convertThreeBlock(number) {
    if (number === "000") {
      return " ";
    }
    switch (number.length) {
      case 0:
        return "";
      case 1:
        return chuHangDonVi[parseInt(number)];
      case 2:
        return convertTwoBlock(number);
      case 3:
        let chuc_dv = "";
        const two_block = number.substring(1, 3);
        if (two_block !== "00") {
          chuc_dv = convertTwoBlock(two_block);
          const char_0 = number.charAt(1);
          const temp = parseInt(number.charAt(0));
          const tram = chuHangTram[temp] + " trăm ";
          return tram + " " + chuc_dv;
        } else {
          const temp = parseInt(number.charAt(0));
          const tram = chuHangTram[temp] + " trăm ";
          return tram;
        }
    }
    return " ";
  }

  const toVietnamese = number => {
    const nb = number.toString();
    let result = "";
    const arr = [];
    let max_index = nb.length - 1;
    let index = nb.length;
    while (index >= 0) {
      if (index - 3 > 0) {
        arr.push(nb.substring(index - 3, index));
      } else {
        arr.push(nb.substring(0, index));
      }
      index -= 3;
    }
    const array_begin = [];
    const array_end = [];

    index = arr.length;
    let stt = 0;
    for (const item of arr) {
      if (item !== "" && item !== "000") {
        result = " " + convertThreeBlock(item);
        if (index > 0) {
          result += dvBlock[stt];
          index -= 1;
        }
        array_begin.push(result);
      }
      stt += 1;
    }
    result = "";
    index = array_begin.length;
    while (index > 0) {
      array_end.push(array_begin[index - 1]);
      index -= 1;
    }
    for (const item of array_end) {
      result += " " + item;
    }
    result = result.replace(/   /g, " ");
    result = result.replace(/  /g, " ");
    return result == " "
      ? `không ${addonAfter}`
      : `${result.trim()} ${addonAfter}`;
  };

  // Sử dụng hàm
  // const chuTiengViet = toVietnamese(number);
  // Kết quả là "...đồng"
  const currencyToWords = toVietnamese(number);
  return currencyToWords;
};
export {formatDateToString, toNumber, convertDateStringToDateObject};
