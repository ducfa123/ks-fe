import React from "react";
import {DatePicker, DatePickerProps} from "@mui/x-date-pickers/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import {formatTime} from "../../types";
import {formatDateToString} from "../../utils/parse";

type TDatePickerProps = {
  value: string | null; // Giá trị có thể là chuỗi ISO hoặc null
  onChange: (isoString: string) => void; // Hàm callback trả về chuỗi ISO
  label?: string;
  error?: boolean; // ✅ Thêm error
  helperText?: string; // ✅ Thêm helperText
  format?: formatTime;
} & Omit<DatePickerProps<Dayjs>, "value" | "onChange">; // ✅ Nhận mọi props từ DatePicker, trừ value & onChange

const TDatePicker: React.FC<TDatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  helperText,
  format,
  ...otherProps
}) => {
  const handleChange = (date: Dayjs | null) => {
    if (date) {
      const timeString = formatDateToString(date, format)?.toString(); // ✅ Convert thành ISO 8601
      onChange(timeString);
    } else {
      onChange(""); // ✅ Nếu xóa ngày, trả về chuỗi rỗng
    }
  };

  return (
    <DatePicker
      label={label || "Chọn ngày"}
      value={dayjs(value, format, true).isValid() ? dayjs(value, format) : null}
      onChange={handleChange}
      format={format ?? formatTime.dayFull} // ✅ Hiển thị giờ & ngày theo format mong muốn
      {...otherProps} // ✅ Nhận tất cả các props khác
      slotProps={{
        textField: {
          error: error, // ✅ Truyền error vào TextField
          helperText: helperText, // ✅ Truyền helperText vào TextField
        },
      }}
    />
  );
};

export {TDatePicker};
