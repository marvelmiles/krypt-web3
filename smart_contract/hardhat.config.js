require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/8a9bc9660fb1460a9cdbdfedb9612b1c",
      chainId: 11155111,
      accounts: [
        "ec30b5144ba8004b688372e5aa9fce280dc5dc7ba73efc2c39a7d9f47174de7f",
      ],
    },
  },
};
