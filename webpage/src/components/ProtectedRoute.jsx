import { Navigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const { account, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!account) {
        try {
          await connectWallet();
        } catch (error) {
          console.error("Wallet connection failed:", error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [account, connectWallet]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!account) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
