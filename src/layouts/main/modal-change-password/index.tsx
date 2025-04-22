import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ModalComponent } from "../../../components";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { FaTimes, FaSave } from "react-icons/fa";

type ModalChangePasswordProps = {
  visible: boolean;
  onClose: () => void;
};

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: 350,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const ModalChangePassword: FC<ModalChangePasswordProps> = ({
  visible,
  onClose,
}) => {
  const { success, error } = useNotifier();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [visible]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTogglePasswordVisibility = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      error("Xác nhận mật khẩu không chính xác");
      return;
    }
    try {
      await APIServices.Auth.changeMyPassword(
        formData.oldPassword,
        formData.newPassword
      );
      success("Đổi mật khẩu thành công");
      onClose();
    } catch {
      error("Đổi mật khẩu thất bại");
    }
  };

  const renderPasswordField = (
    name: "oldPassword" | "newPassword" | "confirmPassword",
    label: string
  ) => (
    <StyledTextField
      name={name}
      label={label}
      type={showPassword[name] ? "text" : "password"}
      value={formData[name]}
      onChange={handleChange}
      required
      fullWidth
      variant="outlined"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => handleTogglePasswordVisibility(name)}
              edge="end"
            >
              {showPassword[name] ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <ModalComponent visible={visible} title="Đổi mật khẩu" onClose={onClose}>
      <StyledForm onSubmit={handleSubmit}>
        {renderPasswordField("oldPassword", "Mật khẩu cũ")}
        {renderPasswordField("newPassword", "Mật khẩu mới")}
        {renderPasswordField("confirmPassword", "Xác nhận mật khẩu mới")}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<FaTimes />}
            sx={{
              backgroundColor: "gray",
              textTransform: "none !important",
              fontFamily: "Be Vietnam Pro",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            type="submit"
            startIcon={<FaSave />}
            sx={{
              backgroundColor: "#0A8DEE",
              textTransform: "none !important",
              fontFamily: "Be Vietnam Pro",
            }}
          >
            Lưu
          </Button>
        </Box>
      </StyledForm>
    </ModalComponent>
  );
};
