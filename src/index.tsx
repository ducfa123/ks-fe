import { KhaoSatResponsesPage } from "./pages/management/khao-sat/responses";

// ...existing code...

// Inside your router configuration
<Routes>
  {/* ...existing routes... */}
  <Route path="/admin/quan-ly-khao-sat/:id" element={<KhaoSatDetailPage />} />
  <Route path="/admin/quan-ly-khao-sat/:id/phan-hoi" element={<KhaoSatResponsesPage />} />
  {/* Eventually you may need to add a response detail route */}
  <Route path="/admin/quan-ly-khao-sat/:id/phan-hoi/:responseId" element={<ResponseDetailPage />} />
</Routes>