# Using recursion to implement base**exponent
def power(num, pwr):
	if pwr == 0:
		return 1
	else:
		return num * power(num, pwr-1)

# Using recursion to implement factorial, where 0! = 1 by definition. 3! = 3*2*1
def factorial(num):
	if num == 0:
		return 1
	else:
		return num * factorial(num -1)

# Using recursion to implement the Fibonacci sequence
def fibonacci(n):
        if n == 0:
            return 0
        elif n == 1:
            return 1
        else:
            return fibonacci(n-1) + fibonacci(n-2)