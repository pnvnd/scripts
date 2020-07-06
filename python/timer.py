import time

start_time=time.time()
name=input("Enter your name: ")
end_time=time.time()-start_time

print("Welcome", name, "\n")
print("User:", name, "logged in at", time.strftime("%D %H:%M:%S"))
print("It took", name, end_time, "seconds to log into their account.")
