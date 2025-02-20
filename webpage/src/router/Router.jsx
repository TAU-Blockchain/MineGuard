import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Admin from "../pages/Admin";
import Scan from "../components/Scan";
import Report from "../components/Report";

function Router() {
  const routes = [
    { path: "/", element: Home },
    { path: "/admin", element: Admin },
    { path: "/scan", element: Scan },
    { path: "/report", element: Report },
  ];

  return (
    <Layout>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default Router;
