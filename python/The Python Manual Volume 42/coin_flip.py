import random
output={"Heads":0, "Tails":0}
coin=list(output.keys())

for i in range(100000):
    output[random.choice(coin)] += 1

print("Heads:", output["Heads"])
print("Tails:", output["Tails"])
