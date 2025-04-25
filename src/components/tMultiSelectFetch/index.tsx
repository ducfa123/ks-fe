import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  FormHelperText,
  TextField,
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
}

export const TMultiSelectFetch: React.FC<TMultiSelectFetchProps> = ({
  label,
  fetchOptions,
  defaultOptions = [],
  value,
  onChange,
  error,
  helperText,
}) => {
  const [options, setOptions] = useState<OptionType[]>(defaultOptions);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchOptions(searchText);
      setOptions(res);
      setLoading(false);
    };
    load();
  }, [searchText]);

  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ")
        }
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 300 },
          },
        }}
      >
        <MenuItem disableRipple disableTouchRipple disableGutters>
          <TextField
            autoFocus
            placeholder="Tìm kiếm..."
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            variant="standard"
          />
        </MenuItem>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={value?.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Không có dữ liệu</MenuItem>
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
