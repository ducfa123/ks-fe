import { KhaoSatThamGiaPage } from "../pages/Client/ThamGiaKhaoSat";

// Assuming this file contains routes definitions for the client side

// Modify the routes definition to make survey routes public
// Find the route that contains path="/khao-sat/:id" and remove any auth requirements
// For example:

// Example snippet (modify according to your actual file structure):
const routes = [
  // ...other routes
  {
    path: "/khao-sat/:id",
    element: <KhaoSatThamGiaPage />,
    // Remove any auth-related wrappers or guards for this route
  },
  // ...other routes
];

export default routes;