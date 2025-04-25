import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Business,
  People,
  EmojiEvents,
  Support,
} from "@mui/icons-material";

const teamMembers = [
  {
    name: "Nguyễn Văn A",
    position: "Giám đốc điều hành",
    avatar: "/assets/images/team/member1.jpg",
  },
  {
    name: "Trần Thị B",
    position: "Trưởng phòng kinh doanh",
    avatar: "/assets/images/team/member2.jpg",
  },
  {
    name: "Lê Văn C",
    position: "Trưởng phòng kỹ thuật",
    avatar: "/assets/images/team/member3.jpg",
  },
];

const features = [
  {
    icon: <Business fontSize="large" />,
    title: "Chuyên nghiệp",
    description: "Đội ngũ nhân viên chuyên nghiệp, tận tâm với khách hàng",
  },
  {
    icon: <People fontSize="large" />,
    title: "Uy tín",
    description: "Cam kết chất lượng sản phẩm và dịch vụ tốt nhất",
  },
  {
    icon: <EmojiEvents fontSize="large" />,
    title: "Kinh nghiệm",
    description: "Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ",
  },
  {
    icon: <Support fontSize="large" />,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng",
  },
];

export const ClientAboutPage = () => {
  return (
    <Container sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Về chúng tôi
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Chúng tôi là đơn vị cung cấp các sản phẩm công nghệ hàng đầu Việt Nam
        </Typography>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
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
              }}
            >
              <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đội ngũ của chúng tôi
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
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
                }}
              >
                <Avatar
                  src={member.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography color="text.secondary">
                  {member.position}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Sứ mệnh của chúng tôi
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Chúng tôi cam kết mang đến cho khách hàng những sản phẩm công nghệ chất
          lượng cao với giá cả cạnh tranh. Đồng thời, chúng tôi luôn nỗ lực để
          cải thiện dịch vụ và trải nghiệm mua sắm của khách hàng.
        </Typography>
      </Box>
    </Container>
  );
}; 