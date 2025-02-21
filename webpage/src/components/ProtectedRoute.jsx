import { Navigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const { account } = useWeb3();

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
