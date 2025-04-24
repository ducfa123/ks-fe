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
import { formatDateTime, formatNumberVND } from "../../../utils/common";

export const PhieuGiamGiaPage = () => {
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

  // load data
  const loadData = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = ""
  ) => {
    try {
      const request = await APIServices.PhieuGiamGiaService.getListEntity(
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

  // handle
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
      await APIServices.PhieuGiamGiaService.removeEntity(row?._id);

      success("Xoá phiếu giảm giá thành công");
    } catch {
      error("Xoá phiếu giảm giá thất bại");
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
        await APIServices.PhieuGiamGiaService.updateEntity(data._id, data);
        success("Cập nhật phiếu giảm giá thành công");
      } else {
        await APIServices.PhieuGiamGiaService.insertEntity(data);
        success("Thêm phiếu giảm giá thành công");
      }
    } catch (ex) {
      if (values._id) error("Cập nhật phiếu giảm giá thất bại");
      else error("Thêm phiếu giảm giá thất bại");
    } finally {
      setModalOpen(false);
      loadData();
    }
  };

  let rowsRender = addActionToRows(
    entities,
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
  rowsRender = addFieldToItems(rowsRender, "loai_text", (row: any) => {
    return row?.loai === "giam_phan_tram" ? "Giảm phần trăm" : "Giảm tiền";
  });
  rowsRender = addFieldToItems(rowsRender, "noi_dung_giam", (row: any) => {
    return row?.loai === "giam_phan_tram"
      ? `Giảm ${row?.giam_phan_tram}%`
      : `Giảm ${formatNumberVND(row?.giam_tien)} VNĐ`;
  });
  rowsRender = addFieldToItems(rowsRender, "thoi_gian_bat_dau", (row: any) => {
    return formatDateTime(row?.thoi_gian_bat_dau);
  });
  rowsRender = addFieldToItems(rowsRender, "thoi_gian_ket_thuc", (row: any) => {
    return formatDateTime(row?.thoi_gian_ket_thuc);
  });

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topBarStyle}>
        <Box>
          <Button
            variant="contained"
            startIcon={<IoAddCircle />}
            sx={styles.addButtonStyle}
            onClick={() => handleOpenModal()}
          >
            Thêm phiếu giảm giá
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
        columns={columnForms}
        initialValues={editingData}
        onSubmit={handleSubmit}
      />

      <TShowConfirm
        visible={modalConfirmRemove}
        title={"Thông báo"}
        message={`Bạn có chắc chắn xoá phiếu giảm giá [${currentEntity?.ma_code}] không?`}
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
