# Using upper() + lower() + loop
# Alternate cases in String
def altCase(original):
    #original = input("Enter a string to convert: ")
    alt = ""
    for n in range(len(original)):
        if not (n%2):
            alt = alt + original[n].upper()
        else:
            alt = alt + original[n].lower()
    
    # printing result  
    # print(str(alt))
    return alt
