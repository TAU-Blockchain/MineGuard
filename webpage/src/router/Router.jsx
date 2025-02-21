import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Admin from "../pages/Admin";
import Scan from "../pages/Scan";
import Report from "../pages/Report";
import ProtectedRoute from "../components/ProtectedRoute";

function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/scan" element={<Scan />} />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default Router;
