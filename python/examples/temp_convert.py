#from decimal import *

'''Temperature Converter'''

print("Convert to '°C' or '°F'?")
deg = input(">> ")
loop = "Y"

while (loop.lower() == "y"):
    try:
        # C=5/9*(F-32)
        if deg.upper() == "C":
            temp = input("Enter Fahrenheit temperature: ")
            print(temp, "°F is", round(5/9*(int(temp)-32),2), "°C")

        # F=(9/5*C)+32
        elif deg.upper() == "F":
            temp = input("Enter Celsius temperature: ")
            print(temp, "°C is", round(9/5*int(temp)+32,2), "°F")

        else:
            print("Invalid input!")

    except ValueError:
            print("Enter a NUMBER, try again.")
    else:
        loop = input("Again? [Y/n]: ").upper()



