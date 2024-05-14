import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

const defaultTsxCtxValue = {
  transactionCount: 0,
  connectWallet: null,
  transactions: [],
  currentAccount: null,
  isLoading: false,
  sendTransaction: undefined,
  handleChange: undefined,
  formData: {},
  isFetchingAcc: true,
};

export const TransactionContext = React.createContext(defaultTsxCtxValue);

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAcc, setIsFetchingAcc] = useState(true);
  const [isFetchingTx, setIsFetchingTx] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    setIsFetchingTx(true);

    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
        setIsFetchingTx(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingTx(false);
    }
  };

  const connectWallet = async (config) => {
    try {
      if (typeof config.method !== "string")
        config = {
          method: "eth_requestAccounts",
        };

      setIsFetchingAcc(true);

      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request(config);

      if (accounts[0]) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No Wallet");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    } finally {
      setIsFetchingAcc(false);
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        setIsLoading(true);

        if (isLoading) return;

        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setFormData({});
        getAllTransactions();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // connect directly with active user
    connectWallet({ method: "eth_accounts" });
  }, []);

  const contextValue = useMemo(
    () => ({
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      isFetchingAcc,
      isFetchingTx,
    }),
    [
      connectWallet,
      transactions,
      currentAccount,
      isLoading,
      sendTransaction,
      handleChange,
      formData,
      isFetchingAcc,
      isFetchingTx,
    ]
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
