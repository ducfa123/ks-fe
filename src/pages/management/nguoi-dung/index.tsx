import {Box} from "@mui/system";
import * as styles from "./styles";
import {useEffect, useState} from "react";
import {APIServices} from "../../../utils";
import {TTable} from "../../../components/tTable";
import {
  addActionToRows,
  addFetchOptionsToColumns,
  addFieldToItems,
  addOptionsToColumns,
} from "../../../utils/table-helper";
import {columnForms, columns} from "./types";
import {TShowConfirm} from "../../../components";
import {useNotifier} from "../../../provider/NotificationProvider";
import TSearchText from "../../../components/tSearchText";
import {Button} from "@mui/material";
import {IoAddCircle} from "react-icons/io5";
import {TFormModal} from "../../../components/tFormModal";
import {FaEdit, FaTrash} from "react-icons/fa";
import {MAX_ENTITY_REQUEST} from "../../../const";
import {formatNumberVND} from "../../../utils/common";
import {TAutoComplete} from "../../../components/tAutoComplete"; // ✅ Thêm import này

export const NguoiDungPage = () => {
  const [nguoiDungs, setNguoiDungs] = useState<any>([]);
  const [currentEntity, setCurrentEntity] = useState<any | null>(null);

  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [modalConfirmRemove, setModalConfirmRemoveState] =
    useState<boolean>(false);

  const {success, error} = useNotifier();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | null>(
    null
  );

  const [vaiTros, setVaiTros] = useState<Array<{value: string; label: string}>>(
    []
  );
  const [vaiTroFilter, setVaiTroFilter] = useState<string[]>([]); // ✅ State filter vai_tro_name

  const loadData = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = "",
    vaiTros = vaiTroFilter
  ) => {
    try {
      let request;

      if (vaiTros.length > 0) {
        request = await APIServices.NguoiDungService.getListEntityByVaiTros(
          requestIndex,
          requestSize,
          requestText,
          vaiTros
        );
      } else {
        request = await APIServices.NguoiDungService.getListEntity(
          requestIndex,
          requestSize,
          requestText
        );
      }

      const {items, total, page, size} = request;
      setNguoiDungs(items);
      setPageSize(size);
      setPageIndex(page);
      setTotal(total);
    } catch (e) {}
  };

  const loadVaiTros = async () => {
    const request = await APIServices.VaiTroService.getListEntity(
      1,
      MAX_ENTITY_REQUEST
    );
    const {items} = request;
    const entities: Array<{label: string; value: string}> = items?.map(item => {
      return {
        value: item?._id,
        label: item?.ten,
      };
    });

    setVaiTros(entities);
  };

  useEffect(() => {
    loadData();
    loadVaiTros();
  }, []);

  const handleSearch = (value: string) => {
    loadData(pageSize, 1, value);
  };

  const handleChangeVaiTroFilter = (value: any) => {
    if (Array.isArray(value)) {
      setVaiTroFilter(value);
      loadData(pageSize, 1, "", value);
    }
  };

  const handleEdit = row => {
    handleOpenModal(row);
  };

  const handleConfirmDelete = row => {
    setCurrentEntity(row);
    setModalConfirmRemoveState(true);
  };

  const handleRemove = async row => {
    try {
      await APIServices.NguoiDungService.removeEntity(row?._id);

      success("Xoá người dùng thành công");
    } catch {
      error("Xoá người dùng thất bại");
    } finally {
      setModalConfirmRemoveState(false);
      loadData();
    }
  };

  const handleOpenModal = (data?: Record<string, any>) => {
    setEditingData(data || {});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingData({});
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const {actions: _, ...data} = values;

    try {
      if (data._id) {
        await APIServices.NguoiDungService.updateEntity(data._id, data);
        success("Cập nhật người dùng thành công");
      } else {
        await APIServices.NguoiDungService.insertEntity(data);
        success("Thêm người dùng thành công");
      }
    } catch (ex) {
      if (values._id) error("Cập nhật người dùng thất bại");
      else error("Thêm người dùng thất bại");
    } finally {
      setModalOpen(false);
      loadData();
    }
  };

  let rowsRender = addFieldToItems(nguoiDungs, "vai_tro_text", (row: any) => {
    return row?.chi_tiet_vai_tro?.ten ?? "";
  });
  rowsRender = addFieldToItems(rowsRender, "vai_tro_display", (row: any) => {
    let ans = row?.chi_tiet_vai_tro?.ten ?? "";
    if (row?.con_em_detail) ans += ` [${row?.con_em_detail?.ho_ten}]`;
    return ans;
  });
  rowsRender = addFieldToItems(rowsRender, "trung_tam_display", (row: any) => {
    return row?.trung_tam_detail?.ten;
  });
  rowsRender = addActionToRows(
    rowsRender,
    [
      {
        label: "Sửa",
        icon: <FaEdit />,
        color: "#0A8DEE",
        onClick: handleEdit,
      },
      {
        label: "Xoá",
        icon: <FaTrash />,
        color: "#ff6666",
        onClick: handleConfirmDelete,
      },
    ],
    "flex-end"
  );
  rowsRender = addFieldToItems(rowsRender, "so_du_text", (row: any) => {
    return (
      <Box
        sx={{
          fontWeight: 500,
          display: "flex",
          gap: "5px",
          justifyContent: "flex-end",
        }}
      >
        {formatNumberVND(row?.so_du ?? 0)}
      </Box>
    );
  });

  // form
  let finalColumnForm = addOptionsToColumns(columnForms, "vai_tro", vaiTros);
  finalColumnForm = addFetchOptionsToColumns(
    finalColumnForm,
    "con_em",
    async (input: string) => {
      try {
        const res = await APIServices.NguoiDungService.getListEntityByVaiTros(
          1,
          8,
          input,
          ["Học sinh"]
        );
        const {items} = res;
        return items.map((item: any) => ({
          value: item._id,
          label: item.ho_ten,
        }));
      } catch {
        return [];
      }
    }
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topBarStyle}>
        <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
          <Button
            variant="contained"
            startIcon={<IoAddCircle />}
            sx={styles.addButtonStyle}
            onClick={() => handleOpenModal()}
          >
            Thêm người dùng
          </Button>
        </Box>

        <TSearchText onSearch={handleSearch} />
      </Box>

      <Box sx={styles.topBarStyle}>
        {/* ✅ Filter theo vai trò */}
        <Box sx={{minWidth: "300px", background: "white"}}>
          <TAutoComplete
            label="Lọc theo vai trò"
            options={vaiTros.map(item => {
              return {label: item?.label, value: item?.label};
            })}
            multiple
            initValue={vaiTroFilter}
            onChange={handleChangeVaiTroFilter}
            error={false}
            helperText=""
          />
        </Box>
      </Box>

      <Box sx={styles.tableContainerStyle}>
        <TTable
          rows={rowsRender}
          columns={columns}
          showIndex={true}
          pageSize={pageSize}
          pageIndex={pageIndex}
          total={total}
          onChangePage={value => {
            loadData(pageSize, value);
          }}
          onRowPerPageChange={value => {
            loadData(value, 1);
          }}
        />
      </Box>

      <TFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        columns={finalColumnForm}
        initialValues={editingData}
        onSubmit={handleSubmit}
      />

      <TShowConfirm
        visible={modalConfirmRemove}
        title={"Thông báo"}
        message={`Bạn có chắc chắn xoá người dùng [${currentEntity?.ho_ten}] không?`}
        onConfirm={() => {
          setModalConfirmRemoveState(false);
          if (currentEntity) handleRemove(currentEntity);
        }}
        onClose={() => {
          setModalConfirmRemoveState(false);
        }}
        onCancel={() => {
          setModalConfirmRemoveState(false);
        }}
      />
    </Box>
  );
};
