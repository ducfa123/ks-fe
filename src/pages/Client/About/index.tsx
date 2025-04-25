import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import {
  LocalShipping,
  Security,
  SupportAgent,
  Star,
} from "@mui/icons-material";

const features = [
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: "Giao hàng nhanh chóng",
    description: "Giao hàng toàn quốc trong 24h với đơn hàng trên 1 triệu đồng",
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: "Bảo hành chính hãng",
    description: "Bảo hành 12 tháng cho tất cả sản phẩm chính hãng",
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40 }} />,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc",
  },
  {
    icon: <Star sx={{ fontSize: 40 }} />,
    title: "Sản phẩm chất lượng",
    description: "Cam kết cung cấp sản phẩm chính hãng, chất lượng cao",
  },
];

const teamMembers = [
  {
    name: "Nguyễn Văn A",
    position: "Giám đốc điều hành",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Trần Thị B",
    position: "Trưởng phòng kinh doanh",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Lê Văn C",
    position: "Chuyên viên tư vấn",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
];

export const ClientAboutPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #098DEE 0%, #63B3ED 100%)",
          py: 10,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
            Về chúng tôi
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: 800, mx: "auto" }}>
            IntX shop - Nơi cung cấp các sản phẩm công nghệ chất lượng cao với
            giá cả phải chăng
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mb: 3, color: "#098DEE" }}>
                Sứ mệnh của chúng tôi
              </Typography>
              <Typography variant="body1" paragraph>
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm công
                nghệ chất lượng cao nhất với giá cả cạnh tranh. Với đội ngũ nhân
                viên chuyên nghiệp và tận tâm, chúng tôi luôn nỗ lực để mang lại
                trải nghiệm mua sắm tốt nhất cho khách hàng.
              </Typography>
              <Typography variant="body1" paragraph>
                IntX shop không chỉ là nơi mua sắm, mà còn là đối tác đáng tin
                cậy của bạn trong hành trình khám phá thế giới công nghệ.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Mission"
                sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ mb: 6, textAlign: "center", color: "#098DEE" }}
          >
            Tại sao chọn chúng tôi?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ color: "#098DEE", mb: 2 }}>{feature.icon}</Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography
            variant="h4"
            sx={{ mb: 6, textAlign: "center", color: "#098DEE" }}
          >
            Đội ngũ của chúng tôi
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.position}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact CTA */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          py: 8,
        }}
      >
        <Container>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ mb: 2, fontWeight: "bold", color: "#098DEE" }}
            >
              Bạn có câu hỏi?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#098DEE",
                "&:hover": { bgcolor: "#2B6CB0" },
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Liên hệ ngay
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
