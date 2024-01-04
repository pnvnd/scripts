import time
lyrics=open("C:\\Users\\Peter\\Desktop\\Python\\lyrics.txt")
lines=lyrics.read()
for lines in lines:
    print(lines, end="")
    time.sleep(.01)
