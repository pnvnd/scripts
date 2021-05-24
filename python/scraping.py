#pip install beautifulsoup4
#pip install requests-html pyppeteer
#pip install selenium
# need webdriver for selenium first, download and add to path

import requests
from bs4 import BeautifulSoup
import pandas as pd

def example1():
    start_url = "http://www.datacrunch.ca"
    downloaded_html = requests.get(start_url)
    soup = BeautifulSoup(downloaded_html.text, features="html.parser")
    with open("downloaded.html", "w") as file:
        file.write(soup.prettify())
    #print(downloaded_html.text)

def example2():
    url = "http://www.datacrunch.ca"
    html = requests.get(url).text

    soup = BeautifulSoup(html, features="html.parser")
    #print(soup.prettify())
    return soup.find_all("summary")

"""
scapy shell -s USER_AGENT='Mozilla/5.0...' 'https://www.google.com'
"""

def example3():
    r.html.render(sleep=5)
    tesla = r.html.find('dev', first=True)
    model = tesla.find('h3', first=True).text
    print(model)

def example4():
    from selnium import webdriver
    from selenium.webdriver.support.ui import WebDriverWait
    import time

    start_url = "www.google.com"

    with webdriver.Firefox() as driver:
        wait = WebDriverWait(driver, 10)
        driver.get(start_url)

        time.sleep(10)
        #wait.until(...) #check condition liek XPATH
        
