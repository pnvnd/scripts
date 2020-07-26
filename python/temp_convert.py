'''Temperature Converter'''

print("Convert to 'C' or 'F'?")
deg = input(">> ")
loop = "Y"

while (loop == "Y" or loop =="y"):
    try:
        # C=5/9*(F-32)
        if deg == "C" or deg == "c":
            temp = input("Enter Fahrenheit temperature: ")
            print(temp, "F is", 5/9*(int(temp)-32), "C")

        # F=(9/5*C)+32
        elif deg == "F" or deg == "f":
            temp = input("Enter Celsius temperature: ")
            print(temp, "C is", 9/5*int(temp)+32, "F")

        else:
            print("Invalid input!")

    except ValueError:
            print("Enter a NUMBER, try again.")
    else:
        loop = input("Again? [Y/n]: ")




