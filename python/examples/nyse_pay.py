# pip install yfinance

import pandas as pd
import yfinance as yf
import pprint
pp = pprint.PrettyPrinter(indent=1)


pay_df = yf.download('PAY', start='2021-05-25', end='2021-06-03', progress=False)
pay_df.head()

ticker = yf.Ticker('PAY')

#pay_df = ticker.history(period="max")
#pay_df['Close'].plot(title="Paymentus Holdings Inc. Stock Price")
#pp.pprint(ticker.info)
