from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data import fetch_crypto_data, fetch_history
from model import predict_next

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Crypto API running"}

@app.get("/crypto")
def crypto():
    df = fetch_crypto_data()
    return df.to_dict(orient="records")

@app.get("/history")
def history(coin: str = "bitcoin"):
    df = fetch_history(coin)
    return df.to_dict(orient="records")

@app.get("/predict")
def predict(coin: str = "bitcoin"):
    df = fetch_history(coin)
    return {"prediction": predict_next(df)}