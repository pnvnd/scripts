# pip install pandas
import glob
import pandas as pd

# Get all CSV files in folder
interesting_files = glob.glob("*.csv")

# Store in dataFrame with header only in first row
df = pd.concat((pd.read_csv(f, header = 0) for f in interesting_files))

# Output dataFrame to CSV file on Desktop
df.to_csv("output.csv")
