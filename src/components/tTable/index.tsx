import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Table,
  Box,
  Checkbox,
} from "@mui/material";
import { Column, Data } from "./types";
import * as styles from "./styles";
import { EmptyStateContainer, EmptyStateCell, EmptyStateRow } from "./styles";

interface TTableProps {
  columns: Column[];
  rows: Data[];
  rowsPerPageOptions?: number[];
  showIndex?: boolean;

  pageSize?: number;
  pageIndex?: number;
  total?: number;
  onChangePage?: (value: number) => void;
  onRowPerPageChange?: (value: number) => void;

  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (checked: boolean) => void;
  rowIdKey?: string;
}

export const TTable: React.FC<TTableProps> = ({
  rows,
  columns,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  showIndex = false,

  pageSize = 10,
  pageIndex = 1,
  total = 0,
  onChangePage = () => {},
  onRowPerPageChange = () => {},

  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  rowIdKey = "_id",
}) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onChangePage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRowPerPageChange(+event.target.value);
  };

  const allSelected =
    rows.length > 0 &&
    rows.every((row) => selectedIds.includes(String(row[rowIdKey])));

  let modifiedColumns = [...columns];
  if (showIndex) {
    modifiedColumns = [
      { id: "stt", label: "STT", minWidth: 50 },
      ...modifiedColumns,
    ];
  }
  if (selectable) {
    modifiedColumns = [
      { id: "checkbox", label: "", minWidth: 50 },
      ...modifiedColumns,
    ];
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {modifiedColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={styles.headerStyle}
                >
                  {column.id === "checkbox" ? (
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selectedIds.length > 0 && !allSelected}
                      onChange={(e) => onToggleSelectAll?.(e.target.checked)}
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": {
                          color: "#fff",
                        },
                        "&.MuiCheckbox-indeterminate": {
                          color: "#fff",
                        },
                      }}
                    />
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 && (
              <EmptyStateRow>
                <EmptyStateCell colSpan={modifiedColumns.length}>
                  <EmptyStateContainer>
                    Không có dữ liệu hiển thị
                  </EmptyStateContainer>
                </EmptyStateCell>
              </EmptyStateRow>
            )}

            {rows.length > 0 &&
              rows.map((row, index) => {
                const rowId = String(row[rowIdKey]);
                const isChecked = selectedIds.includes(rowId);

                return (
                  <TableRow hover key={`row-${index}`}>
                    {modifiedColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={styles.rowStyle}
                      >
                        {column.id === "checkbox" ? (
                          <Checkbox
                            checked={isChecked}
                            onChange={() => onToggleSelect?.(rowId)}
                          />
                        ) : column.id === "stt" ? (
                          (pageIndex - 1) * pageSize + index + 1
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={pageIndex - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng trên mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `Trang ${from}–${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`
        }
      />
    </Box>
  );
};
