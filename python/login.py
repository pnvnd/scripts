import time
users = {}
status = ""



def mainMenu():
    global status
    status = input("Do you have a login account? [Y/n] or q to quit: ")
    if status == "Y":
        oldUser()
    elif status == "n":
        newUser()
    elif status == "q":
        quit()

def newUser():
    createLogin = input("Create a login name: ")

    if createLogin in users:
        print("\nLogin name exists!\n")
    else:
        createPass = input("Create password: ")
        users[createLogin] = createPass
        print("\nUser created!\n")
        logins = open("C:\\Users\\Peter\\Desktop\\logins.txt", "a")
        logins.write("\n" + createLogin + " " + createPass)
        logins.close()

def oldUser():
    login = input("Enter login name: ")
    password = input("Enter password: ")

    # check if user exists and login matches passsword
    if login in users and users[login] == password:
        print("\nLogin successful\n")
        print("User:", login, "accessed the system on: ", time.asctime())
    else:
        print("\nUser does not exist or wrong password!\n")


while status != "q":
    status = mainMenu()
