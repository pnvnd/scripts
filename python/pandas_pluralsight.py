import pandas as pd
import numpy as np


import os

""" Examples
my_numpay_array = np.random.rand(3)
my_first_series = pd.Series(np.random.rand(3))
my_first_df = pd.DataFrame(np.random.rand(3,2))

my_series = pd.Series(my_numpay_array, index=["First", "Second", "Third"])
array_2d = np.random.rand(3,2)
df = pd.DataFrame(array_2d)
"""

CSV_PATH = "/home/peter/Desktop/covidtesting.csv"
COLS_TO_USE = ["Reported Date", "Confirmed Positive", "Deaths", "Resolved", "Total Cases"]

#df = pd.read_csv(CSV_PATH, nrows=5)

df2 = pd.read_csv(CSV_PATH, usecols=COLS_TO_USE)

#len(pd.unique(df2["Reported Date"]))
#df2.loc[df2["Reported Date"]=="2021-04-22","Deaths"]
#df2.to_csv("df2.csv", index=False)
#df.to_csv(columns=["df.csv", "Deaths"])
