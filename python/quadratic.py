# Function to solve the Quadratic Equation a*x**2 + b*x + c = 0

import math

def quadratic():
    print("This programs solves the quadratic equation a*x**2 + b*x + c = 0")

    a = int(input("Enter value for a: "))
    b = int(input("Enter value for b: "))
    c = int(input("Enter value for c: "))
    d = float(b**2 - 4*a*c) # discriminant

    if d > 0:
        root1 = float((-b + math.sqrt(d)) / 2*a)
        root2 = float((-b - math.sqrt(d)) / 2*a)
        print("Equation has two real roots:", root1, "and", root2)

    elif d == 0:
        root1 = float(-b / 2*a)
        print("Equation has one real root:", root1)

    else:
        print("Equation has no real roots!")
