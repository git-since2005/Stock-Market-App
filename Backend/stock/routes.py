import yfinance as yf
from fastapi import APIRouter, HTTPException, Query, Depends, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from database import get_db
from models import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

router = APIRouter(tags=["stock"])

COMPANIES = [
    "TCS.NS",       # Tata Consultancy Services
    "INFY.NS",      # Infosys
    "RELIANCE.NS",  # Reliance Industries
    "HDFCBANK.NS",  # HDFC Bank
    "ICICIBANK.NS", # ICICI Bank
    "HINDUNILVR.NS",# Hindustan Unilever
    "KOTAKBANK.NS", # Kotak Mahindra Bank
    "SBIN.NS",      # State Bank of India
    "LT.NS",        # Larsen & Toubro
    "BAJFINANCE.NS",# Bajaj Finance
    "MARUTI.NS",    # Maruti Suzuki
    "HCLTECH.NS",   # HCL Technologies
    "ITC.NS",       # ITC Limited
    "AXISBANK.NS",  # Axis Bank
    "BHARTIARTL.NS" # Bharti Airtel
]
 # Yahoo Finance tickers for NSE

@router.get("/companies")
def get_companies():
    data = []
    for ticker in COMPANIES:
        stock = yf.Ticker(ticker)
        info = stock.info
        data.append({
            "ticker": ticker,
            "company_name": info.get("shortName"),
            "today_open": info.get("open"),
            "today_high": info.get("dayHigh"),
            "today_low": info.get("dayLow"),
            "today_close": info.get("previousClose"),
            "52_week_high": info.get("fiftyTwoWeekHigh"),
            "52_week_low": info.get("fiftyTwoWeekLow"),
            "average_volume": info.get("averageVolume"),
        })
    return data

@router.get("/companies-intraday")
def get_intraday(
    tickers: str = Query(..., description="Comma-separated ticker symbols, e.g. TCS.NS,RELIANCE.NS"),
    interval: str = Query("5m", description="Intraday interval, e.g., 1m, 5m, 15m")
):
    """
    Fetch intraday stock data for one or multiple tickers.
    """
    tickers_list = [t.strip() for t in tickers.split(",")]

    if not tickers_list:
        raise HTTPException(status_code=400, detail="No valid tickers provided")

    result = []

    for ticker in tickers_list:
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period="1d", interval=interval).reset_index()
            intraday_data = df.to_dict(orient="records")

            result.append({
                "ticker": ticker,
                "company_name": stock.info.get("shortName", ticker),
                "today_open": stock.info.get("open"),
                "today_high": stock.info.get("dayHigh"),
                "today_low": stock.info.get("dayLow"),
                "today_close": stock.info.get("previousClose"),
                "52_week_high": stock.info.get("fiftyTwoWeekHigh"),
                "52_week_low": stock.info.get("fiftyTwoWeekLow"),
                "average_volume": stock.info.get("averageVolume"),
                "intraday_data": intraday_data
            })
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")
            continue

    return result

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        username: str = payload.get("username")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    db_user = db.query(User).filter(User.username == username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    return {"message": f"Hello {username}, you are authenticated!"}