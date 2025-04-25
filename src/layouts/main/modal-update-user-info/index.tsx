import { FC } from "react";
import { Box } from "@mui/material";
import { ModalComponent } from "../../../components";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { TForm } from "../../../components/tForm";
import { updateInfo } from "../../../redux/auth/auth.slice";

type ModalUpdateUserInfoProps = {
  visible: boolean;
  onClose: () => void;
};

const columnForms: any = [
  { id: "ho_ten", label: "Họ và tên", type: "text", required: true },
];

export const ModalUpdateUserInfo: FC<ModalUpdateUserInfoProps> = ({
  visible,
  onClose,
}) => {
  const { success, error } = useNotifier();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.auth.info);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // todo: update after have phong ban
      const { phong_ban: _, ...data } = values;
      const info = await APIServices.Auth.updateUserInfo(data);

      dispatch(updateInfo(info));

      success("Cập nhật thông tin cá nhân thành công");
    } catch {
      error("Cập nhật thông tin cá nhân thất bại");
    } finally {
      onClose();
    }
  };

  return (
    <ModalComponent
      visible={visible}
      title="Cập nhật thông tin cá nhân"
      onClose={onClose}
    >
      <Box sx={{ minWidth: "300px" }}>
        <TForm
          initialValues={userInfo}
          onCancel={onClose}
          onSubmit={handleSubmit}
          columns={columnForms}
        />
      </Box>
    </ModalComponent>
  );
};
