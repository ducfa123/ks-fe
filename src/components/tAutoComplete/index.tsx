import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box, Chip } from "@mui/material";

type Props = {
  label: string;
  options?: { value: any; label: string }[];
  onChange?: (value: any) => void;
  onInputChange?: (event: React.SyntheticEvent, inputValue: string) => void;
  multiple?: boolean;
  freeSolo?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  initValue?: any;
  showError?: boolean;
};

const TAutoComplete: React.FC<Props> = ({
  label,
  options = [],
  onChange,
  onInputChange, // ✅ thêm mới
  multiple = false,
  freeSolo = false,
  required = false,
  error: externalError = true,
  helperText,
  initValue = multiple ? [] : "",
  showError = true,
}) => {
  const [value, setValue] = useState<any>(initValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (required) {
      setError(multiple ? value.length === 0 : !value);
    }
  }, [value, required]);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const handleChange = (_: any, newInputValue: any) => {
    if (multiple) {
      const selectedValues = newInputValue.map((label: string) => {
        const option = options.find((opt) => opt.label === label);
        return option ? option.value : label;
      });
      setValue(selectedValues);
      onChange?.(selectedValues);

      if (externalError) setError(selectedValues.length === 0);
    } else {
      const option = options.find((opt) => opt.label === newInputValue);
      const selectedValue = option ? option.value : newInputValue;
      setValue(selectedValue);
      onChange?.(selectedValue);
      setError(!selectedValue);
    }
  };

  return (
    <Box>
      <Autocomplete
        multiple={multiple}
        freeSolo={freeSolo}
        options={options.map((option) => option.label)}
        value={
          multiple
            ? value.map(
                (v: any) => options.find((opt) => opt.value === v)?.label || v
              )
            : options.find((opt) => opt.value === value)?.label || value
        }
        onChange={handleChange}
        onInputChange={onInputChange} // ✅ truyền xuống prop
        renderTags={(selectedValues, getTagProps) =>
          selectedValues.map((option, index) => (
            <Chip key={index} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            error={showError && (externalError || error)}
            helperText={
              showError &&
              (externalError || error
                ? helperText || `${label} không được để trống`
                : "")
            }
          />
        )}
      />
    </Box>
  );
};

export { TAutoComplete };
