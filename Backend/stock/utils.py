import warnings
warnings.filterwarnings("ignore")

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import pmdarima as pm
from fastapi import HTTPException

def predict_tomorrow_price(ticker: str):
    ticker = ticker.upper()
    end_date = datetime.today()
    start_date = end_date - timedelta(days=2*365)
    
    stock = yf.Ticker(ticker)
    hist = stock.history(start=start_date.strftime("%Y-%m-%d"),
                         end=end_date.strftime("%Y-%m-%d"))
    if hist.empty:
        raise HTTPException(status_code=404, detail=f"No data found for {ticker}")

    closing_prices = hist['Close']
    closing_prices.index = pd.DatetimeIndex(closing_prices.index).to_period('D')

    model = pm.auto_arima(closing_prices,
                          start_p=0, max_p=5,
                          start_q=0, max_q=5,
                          d=None,
                          seasonal=False,
                          stepwise=True,
                          suppress_warnings=True)

    forecast = model.predict(n_periods=1)
    return forecast[0]

def get_last_month_prices(ticker: str):
    ticker = ticker.upper()
    end_date = datetime.today()
    start_date = end_date - timedelta(days=30)
    
    stock = yf.Ticker(ticker)
    hist = stock.history(start=start_date.strftime("%Y-%m-%d"),
                         end=end_date.strftime("%Y-%m-%d"),
                         interval="1d")
    if hist.empty:
        raise HTTPException(status_code=404, detail=f"No data found for {ticker}")

    prices = [{"date": str(idx.date()), "close": row["Close"]} 
              for idx, row in hist.iterrows()]
    return prices
