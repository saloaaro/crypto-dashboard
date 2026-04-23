import requests
import pandas as pd

COINS = [
    "bitcoin",
    "ethereum",
    "solana",
    "ripple",        
    "cardano",
    "dogecoin",
    "polygon",
    "litecoin",
    "chainlink",
    "avalanche-2"
]

def fetch_crypto_data():
    url = "https://api.coingecko.com/api/v3/simple/price"
    
    params = {
        "ids": ",".join(COINS),
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }

    response = requests.get(url, params=params)
    data = response.json()

    rows = []

    for coin in COINS:
        try:
            rows.append({
                "coin": coin,
                "price": data[coin]["usd"],
                "change_24h": data[coin]["usd_24h_change"]
            })
        except:
            print(f"Skipping {coin} (no data)")

    return pd.DataFrame(rows)


def fetch_history(coin="bitcoin"):
    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"

    params = {
        "vs_currency": "usd",
        "days": 30
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "prices" not in data:
        return pd.DataFrame([])

    prices = data["prices"]

    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    df["date"] = pd.to_datetime(df["timestamp"], unit="ms")

    return df