import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Paper,
  Fade,
  useTheme
} from "@mui/material";
import { FaTelegramPlane } from "react-icons/fa";
import { APIServices } from "../../utils";

export const TelegramConnectBox: React.FC = () => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "linked">("idle");
  const [checking, setChecking] = useState(false);
  const theme = useTheme();

  const fetchToken = async () => {
    setStatus("loading");
    try {
      const res = await APIServices.TelegramService.taoTokenLienKetTelegram();
      setQrUrl(res.qr_url);
      setToken(res.token);
    } finally {
      setStatus("idle");
    }
  };

  const pollingCheck = async () => {
    if (!token || status === "linked") return;
    setChecking(true);
    try {
      const res = await APIServices.TelegramService.kiemTraLienKetTelegram(token);
      if (res?.linked) {
        setStatus("linked");
      }
    } catch (err) {
      console.error("Polling error", err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token || status === "linked") return;
    const interval = setInterval(pollingCheck, 3000);
    return () => clearInterval(interval);
  }, [token, status]);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        padding: 4,
        textAlign: "center",
        maxWidth: 400,
        margin: "auto",
        background: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box sx={{ mb: 3 }}>
        <FaTelegramPlane 
          size={40} 
          color={theme.palette.primary.main}
          style={{ marginBottom: 16 }}
        />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Kết nối Telegram
        </Typography>
      </Box>

      <Fade in={status === "linked"}>
        <Box sx={{ 
          display: status === "linked" ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          color: theme.palette.success.main,
          fontWeight: "medium"
        }}>
          <Typography variant="h6">
            ✅ Đã liên kết thành công!
          </Typography>
        </Box>
      </Fade>

      {status !== "linked" && qrUrl && (
        <Fade in={true}>
          <Box>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: theme.palette.text.secondary 
              }}
            >
              Vui lòng mở Telegram và quét mã QR để liên kết:
            </Typography>
            
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: "0 0 20px rgba(0,0,0,0.05)",
                display: "inline-block"
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                  qrUrl
                )}&size=200x200`}
                alt="QR Code"
                style={{ 
                  display: "block",
                  maxWidth: "100%",
                  height: "auto"
                }}
              />
            </Box>

            <Box>
              <Button
                onClick={fetchToken}
                variant="outlined"
                startIcon={<FaTelegramPlane />}
                disabled={status === "loading"}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3
                }}
              >
                Tạo lại mã QR
              </Button>
            </Box>

            {checking && (
              <Box sx={{ mt: 2, color: theme.palette.text.secondary }}>
                <CircularProgress size={20} thickness={4} sx={{ mr: 1 }} />
                <Typography variant="body2" component="span">
                  Đang kiểm tra trạng thái...
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      )}

      {status === "loading" && !qrUrl && (
        <CircularProgress size={30} thickness={4} />
      )}
    </Paper>
  );
};