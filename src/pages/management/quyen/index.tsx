import {Box} from "@mui/system";
import * as styles from "./styles";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIServices} from "../../../utils";
import {FaTrash} from "react-icons/fa";
import {addActionToRows, addFieldToItems} from "../../../utils/table-helper";
import {useNotifier} from "../../../provider/NotificationProvider";
import {TShowConfirm, TTable} from "../../../components";
import {columnForms, columns} from "./types";
import {TFormModal} from "../../../components/tFormModal";
import {IoAddCircle} from "react-icons/io5";
import TSearchText from "../../../components/tSearchText";
import {Button} from "@mui/material";
import {
  getColorOfQuyen,
  getIconOfQuyen,
  getTextOfChucNang,
} from "../../../utils/permission-helper";

export const PhanQuyenPage = () => {
  const {vaiTroId: vaiTroId} = useParams();

  const [quyens, setQuyens] = useState<any>([]);
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

  // load data
  const loadData = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = ""
  ) => {
    try {
      const request = await APIServices.VaiTroService.getQuyenCuaVaiTro(
        vaiTroId,
        requestIndex,
        requestSize,
        requestText
      );
      const {items, total, page, size} = request;
      setQuyens(items);
      setPageSize(size);
      setPageIndex(page);
      setTotal(total);
    } catch {}
  };

  const handleConfirmDelete = row => {
    setCurrentEntity(row);
    setModalConfirmRemoveState(true);
  };

  //handle
  const handleSearch = (value: string) => {
    loadData(pageSize, 1, value);
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
      await APIServices.VaiTroService.insertQuyen({
        ...data,
        ...{
          vai_tro: vaiTroId,
        },
      });
      success("Thêm quyền thành công");
    } catch (ex) {
      error("Thêm quyền thất bại");
    } finally {
      setModalOpen(false);
      loadData();
    }
  };

  const handleRemove = async row => {
    try {
      await APIServices.VaiTroService.removeQuyen(row?._id);

      success("Xoá vai trò thành công");
    } catch {
      error("Xoá vai trò thất bại");
    } finally {
      setModalConfirmRemoveState(false);
      loadData();
    }
  };

  let rowsRender = addActionToRows(
    quyens,
    [
      {
        label: "Xoá",
        icon: <FaTrash />,
        color: "#ff6666",
        onClick: handleConfirmDelete,
      },
    ],
    "flex-end"
  );

  rowsRender = addFieldToItems(rowsRender, "display_name", (item: any) => {
    return getTextOfChucNang(item?.chuc_nang);
  });
  rowsRender = addFieldToItems(rowsRender, "display_quyen", (row: any) => {
    return (
      <Box sx={{display: "flex"}}>
        <Box
          sx={{
            bgcolor: getColorOfQuyen(row?.quyen),
            color: "white",
            fontFamily: "Be Vietnam Pro",
            marginLeft: "5px",
            display: "flex",
            gap: "5px",
            padding: "10px",
            borderRadius: "5px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getIconOfQuyen(row?.quyen)}
          {row?.quyen}
        </Box>
      </Box>
    );
  });

  useEffect(() => {
    loadData();
  }, []);

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
            Thêm Quyền
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
        columns={columnForms}
        initialValues={editingData}
        onSubmit={handleSubmit}
      />

      <TShowConfirm
        visible={modalConfirmRemove}
        title={"Thông báo"}
        message={`Bạn có chắc chắn xoá quyền [${
          currentEntity?.quyen
        }] chức năng [${getTextOfChucNang(currentEntity?.chuc_nang)}] không?`}
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
