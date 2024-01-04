# Find the greatest common denominator of two numbers using Euclid's algorithm
# For two integers a and b, where a > b, divide a by b
# If the remainder, r, is 0, then stop, GCD is b
# Otherwise, set a to b, b to r, and repear at step 1 until r is 0

def gcd(a, b):
	while (b !=0):
		t = a
		a = b
		b = t % b

	return a

print(gcd(60, 96))  # should be 12
print(gcd(20, 8))  # should be 4