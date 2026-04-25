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

    res = requests.get(url, params=params)
    data = res.json()

    result = []

    for coin in COINS:
        if coin in data:
            result.append({
                "coin": coin,
                "price": data[coin].get("usd", 0),
                "change_24h": data[coin].get("usd_24h_change", 0)
            })

    return result



def fetch_history(coin):
    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"

    params = {
        "vs_currency": "usd",
        "days": 30
    }

    res = requests.get(url, params=params)
    data = res.json()

    if "prices" not in data:
        return []

    prices = data["prices"]

    return [
        {"date": p[0], "price": p[1]}
        for p in prices
    ]