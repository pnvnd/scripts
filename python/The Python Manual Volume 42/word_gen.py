import random

print(">>>>>>>>>>Random Word Generator<<<<<<<<<<")
print("\nUsing 466K English word text file, pick random words.\n")

wds=int(input("\nHow many words shall I choose? "))

with open("C://temp//words.txt", "rt") as f:
    words = f.readlines()
words = [w.strip() for w in words]

print("----------")

for w in random.sample(words, wds):
    print(w)

print("----------")
