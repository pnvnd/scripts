def gcd(a, b):
	while (b !=0):
		t = a
		a = b
		b = t % b

	return a

print(gcd(60, 96))  # should be 12
print(gcd(20, 8))  # should be 4
