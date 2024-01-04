# Mean without len() and sum()

def mean():
    numbers = [1,2,3,4,5,6]
    count = 0
    total = 0

    for number in numbers:
        total += number
        count += 1
        avg=total/count
        
    print(avg) # should be 3.5

# Median
def median():
    pass

# Mode
def mode():
    pass
