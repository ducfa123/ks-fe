import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
  Chip,
} from "@mui/material";

interface OptionType {
  label: string;
  value: string;
}

interface TMultiSelectFetchProps {
  label: string;
  fetchOptions: (input?: string) => Promise<OptionType[]>;
  defaultOptions?: OptionType[];
  value: string[];
  onChange: (val: string[]) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

export const TMultiSelectFetch: React.FC<TMultiSelectFetchProps> = ({
  label,
  fetchOptions,
  defaultOptions = [],
  value,
  onChange,
  error,
  helperText,
  placeholder = "Tìm kiếm...",
}) => {
  const [options, setOptions] = useState<OptionType[]>(defaultOptions);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Map value to option objects for Autocomplete
  const selectedOptions = useMemo(
    () => (options ? options?.filter((opt) => value?.includes(opt.value)) : []),
    [options, value]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOptions(inputValue).then((res) => {
      if (active) {
        setOptions(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [inputValue, fetchOptions]);

  return (
    <FormControl fullWidth error={error}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedOptions}
        onChange={(_, newValue) => onChange(newValue.map((opt) => opt.value))}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        loading={loading}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            error={error}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.value}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
              color="primary"
            />
            {option.label}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.label}
              {...getTagProps({ index })}
              key={option.value}
              size="small"
              color="primary"
              style={{ margin: 2 }}
            />
          ))
        }
        noOptionsText="Không có dữ liệu"
      />
      {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
