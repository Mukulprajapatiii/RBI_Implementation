document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressElem = document.getElementById("address");
    const walletBalanceElem = document.getElementById("balance");
    const notification = document.getElementById("notification");
    const transactionSection = document.getElementById("transaction-section");
    const sendTransactionBtn = document.getElementById("send-transaction");
    const themeToggle = document.getElementById("theme-toggle");
    const networkSwitch = document.getElementById("network-switch");
  
    let isDarkMode = false;
  
    // Show notification
    function showNotification(message) {
      notification.textContent = message;
      notification.classList.add("show");
      setTimeout(() => notification.classList.remove("show"), 3000);
    }
  
    // Toggle theme
    function toggleTheme() {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("dark-mode", isDarkMode);
    }
  
    // Connect wallet
    async function connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });
          const account = accounts[0];
          walletAddressElem.textContent = account;
          document.getElementById("wallet-address").classList.remove("hidden");
          const balance = await ethereum.request({
            method: "eth_getBalance",
            params: [account, "latest"],
          });
          walletBalanceElem.textContent = (parseInt(balance, 16) / 1e18).toFixed(4);
          document.getElementById("wallet-balance").classList.remove("hidden");
          transactionSection.classList.remove("hidden");
          showNotification("Wallet connected successfully!");
        } catch (err) {
          showNotification("Failed to connect wallet: " + err.message);
        }
      } else {
        showNotification("MetaMask is not installed!");
      }
    }
  
    // Switch to Sepolia network
    async function switchToSepolia() {
      if (typeof window.ethereum !== "undefined") {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
          });
          document.getElementById("network-name").textContent = "Network: Sepolia";
          showNotification("Switched to Sepolia network!");
        } catch (err) {
          if (err.code === 4902) {
            showNotification("Sepolia network not found in MetaMask!");
          } else {
            showNotification("Failed to switch network: " + err.message);
          }
        }
      } else {
        showNotification("MetaMask is not installed!");
      }
    }
  
    // Send transaction
    async function sendTransaction() {
      const recipient = document.getElementById("recipient").value;
      const amount = document.getElementById("amount").value;
  
      if (!recipient || !amount) {
        showNotification("Please provide a valid recipient and amount.");
        return;
      }
  
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: accounts[0],
              to: recipient,
              value: (amount * 1e18).toString(16), // Convert to Wei
            },
          ],
        });
        showNotification("Transaction sent successfully!");
      } catch (err) {
        showNotification("Failed to send transaction: " + err.message);
      }
    }
  
    // Event listeners
    connectWalletBtn.addEventListener("click", connectWallet);
    themeToggle.addEventListener("click", toggleTheme);
    sendTransactionBtn.addEventListener("click", sendTransaction);
    networkSwitch.addEventListener("click", switchToSepolia);
  });
  