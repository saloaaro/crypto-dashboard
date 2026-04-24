import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "https://crypto-dashboard-1-3znc.onrender.com";

function App() {
  const [crypto, setCrypto] = useState([]);
  const [history, setHistory] = useState([]);
  const [coin, setCoin] = useState("bitcoin");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  // COIN LOGOT
  const coinImages = {
    bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ethereum:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    ripple:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    dogecoin: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    polygon:
      "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    litecoin: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    chainlink:
      "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    "avalanche-2":
      "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
  };

  // FETCH CRYPTO LIST
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/crypto`)
      .then((res) => res.json())
      .then((data) => {
        setCrypto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Crypto fetch error:", err);
        setLoading(false);
      });
  }, []);

  // FETCH HISTORY
  useEffect(() => {
    fetch(`${API}/history?coin=${coin}`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("History fetch error:", err));
  }, [coin]);

  // FORMAT DATA
  const formattedHistory = history.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString(),
  }));

  // PREDICTION
  function getPrediction() {
    fetch(`${API}/predict?coin=${coin}`)
      .then((res) => res.json())
      .then((data) => setPrediction(data.prediction))
      .catch((err) => console.error("Prediction error:", err));
  }

  const selected = crypto.find((c) => c.coin === coin);

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-xl animate-pulse">Loading crypto data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white p-8">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-8">🚀 Crypto Analytics Dashboard</h1>

      {/* COIN SELECTOR */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {crypto.map((c) => (
            <div
              key={c.coin}
              onClick={() => setCoin(c.coin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition whitespace-nowrap
              ${
                coin === c.coin
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <img src={coinImages[c.coin]} alt={c.coin} className="w-6 h-6" />
              <span>{c.coin.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Price</p>
          <h2 className="text-3xl font-bold">${selected?.price || "-"}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">24h Change</p>
          <h2
            className={`text-3xl font-bold ${
              selected?.change_24h > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {selected?.change_24h?.toFixed(2) || "-"}%
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Prediction</p>
          <h2 className="text-3xl font-bold text-blue-400">
            {prediction ? `$${prediction.toFixed(2)}` : "-"}
          </h2>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl mb-4">{coin.toUpperCase()} 30 day trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedHistory}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#60A5FA" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BUTTON */}
      <button
        onClick={getPrediction}
        className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Predict next price
      </button>
    </div>
  );
}

export default App;
