import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import * as styles from "./styles";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

const TSearchText: React.FC<SearchInputProps> = ({
  placeholder = "Tìm kiếm...",
  onSearch,
}) => {
  const [tempQuery, setTempQuery] = useState(""); // Lưu giá trị nhập vào

  // Stable callback to avoid useEffect dependency issues
  const stableOnSearch = useCallback(onSearch, []);

  // Add debounce effect for real-time search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      stableOnSearch(tempQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [tempQuery, stableOnSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTempQuery(value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(tempQuery);
    }
  };

  const handleClear = () => {
    setTempQuery("");
    onSearch("");
  };

  const handleSearchClick = () => {
    onSearch(tempQuery);
  };

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={tempQuery}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      sx={styles.searchInput}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleSearchClick} size="small">
              <SearchIcon sx={styles.icon} />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: tempQuery ? (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
              <ClearIcon sx={styles.icon} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default TSearchText;
