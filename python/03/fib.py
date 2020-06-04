print("Print the first nth Fibonacci numbers up to 9999, enter 'n'")

n = int( input( ">> " ) )

a = 0
b = 1

while b < 9999:
    print(b)
    a, b = b, a + b