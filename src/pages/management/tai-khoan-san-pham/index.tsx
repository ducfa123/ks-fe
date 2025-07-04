import { Box } from "@mui/system";
import * as styles from "./styles";
import { useEffect, useState } from "react";
import { APIServices } from "../../../utils";
import { TTable } from "../../../components/tTable";
import { addActionToRows, addFieldToItems } from "../../../utils/table-helper";
import { columnForms, columns } from "./types";
import { TShowConfirm } from "../../../components";
import { useNotifier } from "../../../provider/NotificationProvider";
import TSearchText from "../../../components/tSearchText";
import { Button } from "@mui/material";
import { IoAddCircle } from "react-icons/io5";
import { TFormModal } from "../../../components/tFormModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export const TaiKhoanSanPhamPage = () => {
  const [entities, setEntities] = useState<any>([]);
  const [currentEntity, setCurrentEntity] = useState<any | null>(null);

  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [modalConfirmRemove, setModalConfirmRemoveState] =
    useState<boolean>(false);

  const { success, error } = useNotifier();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | null>(
    null
  );

  const loadData = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = ""
  ) => {
    try {
      const request = await APIServices.TaiKhoanSanPhamService.getListEntity(
        requestIndex,
        requestSize,
        requestText
      );

      const { items, total, page, size } = request;
      setEntities(items);
      setPageSize(size);
      setPageIndex(page);
      setTotal(total);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    loadData(pageSize, 1, value);
  };

  const handleEdit = (row) => {
    handleOpenModal(row);
  };

  const handleConfirmDelete = (row) => {
    setCurrentEntity(row);
    setModalConfirmRemoveState(true);
  };

  const handleRemove = async (row) => {
    try {
      await APIServices.TaiKhoanSanPhamService.removeEntity(row?._id);

      success("Xoá tài khoản sản phẩm thành công");
    } catch {
      error("Xoá tài khoản sản phẩm thất bại");
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
    const { actions: _, ...data } = values;

    try {
      if (data._id) {
        await APIServices.TaiKhoanSanPhamService.updateEntity(data._id, data);
        success("Cập nhật tài khoản sản phẩm thành công");
      } else {
        await APIServices.TaiKhoanSanPhamService.insertEntity(data);
        success("Thêm tài khoản sản phẩm thành công");
      }
    } catch (ex) {
      if (values._id) error("Cập nhật tài khoản sản phẩm thất bại");
      else error("Thêm tài khoản sản phẩm thất bại");
    } finally {
      setModalOpen(false);
      loadData();
    }
  };

  let rowsRender = addFieldToItems(entities, "san_pham_text", (item: any) => {
    return item?.san_pham_detail?.ten;
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

  // form
  const finalColumnForm = columnForms;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topBarStyle}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button
            variant="contained"
            startIcon={<IoAddCircle />}
            sx={styles.addButtonStyle}
            onClick={() => handleOpenModal()}
          >
            Thêm tài khoản sản phẩm
          </Button>
        </Box>

        <TSearchText onSearch={handleSearch} />
      </Box>

      <Box sx={styles.tableContainerStyle}>
        <TTable
          rows={rowsRender}
          columns={columns}
          showIndex={true}
          pageSize={pageSize}
          pageIndex={pageIndex}
          total={total}
          onChangePage={(value) => {
            loadData(pageSize, value);
          }}
          onRowPerPageChange={(value) => {
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
        message={`Bạn có chắc chắn xoá tài khoản sản phẩm này không?`}
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
