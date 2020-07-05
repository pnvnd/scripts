word = input("Please enter a 4-letter word: ")
word_length = len(word)

if word_length == 4:
    print("\"" + word + "\" is a 4-letter word.  Well done!")
elif word_length ==3:
    print("\"" + word + "\" is a 3-letter word.  Try again.")
else:
    print("\"" + word + "\"" + " is NOT a 4-letter word.  Fuck off.")
