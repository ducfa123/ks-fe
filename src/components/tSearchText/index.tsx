import React, { useState } from "react";
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
  const [query, setQuery] = useState("");
  const [tempQuery, setTempQuery] = useState(""); // Lưu giá trị nhập vào

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setQuery(tempQuery);
      onSearch(tempQuery);
    }
  };

  const handleClear = () => {
    setTempQuery("");
    onSearch("");
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
            <SearchIcon sx={styles.icon} />
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
