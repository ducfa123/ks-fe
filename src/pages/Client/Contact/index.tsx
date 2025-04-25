import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
} from "@mui/icons-material";

export const ClientContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const contactInfo = [
    {
      icon: <LocationOn fontSize="large" />,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 1, TP.HCM",
    },
    {
      icon: <Phone fontSize="large" />,
      title: "Điện thoại",
      content: "0123 456 789",
    },
    {
      icon: <Email fontSize="large" />,
      title: "Email",
      content: "support@example.com",
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    },
  ];

  return (
    <Container sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Liên hệ với chúng tôi
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Thông tin liên hệ
            </Typography>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Box sx={{ color: "primary.main", mr: 2 }}>
                          {info.icon}
                        </Box>
                        <Typography variant="h6">{info.title}</Typography>
                      </Box>
                      <Typography color="text.secondary">
                        {info.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Gửi tin nhắn cho chúng tôi
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nội dung"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      Gửi tin nhắn
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}; 