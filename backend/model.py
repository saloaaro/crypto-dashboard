from sklearn.linear_model import LinearRegression
import numpy as np

def predict_next(df):
    df = df.reset_index()

    X = np.array(range(len(df))).reshape(-1, 1)
    y = df["price"].values

    model = LinearRegression()
    model.fit(X, y)

    pred = model.predict([[len(df)]])
    return float(pred[0])