import { useWeb3 } from "../context/Web3Context";

export const useContract = () => {
  const { contract } = useWeb3();
  return contract;
};
