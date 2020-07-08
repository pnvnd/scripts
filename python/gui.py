from tkinter import *

root = Tk()
logo = PhotoImage(file="C:\\Users\\Peter\\Documents\\GitHub\\scripts\\python\\heli.png")
w1 = Label(root, root.title("Temperature Converter"), image=logo).pack(side="right")

content = """Robocar Poli is cool, but so is Heli!"""
w2 = Label(root, justify=LEFT, padx = 10, text=content).pack(side="left")

v = IntVar()

Label(root, root.title("Options"), text="""Choose a preferred language:""", justify = LEFT, padx = 20).pack()

Radiobutton(root, text="Python", padx = 2, variable=v, value=1).pack(anchor=E)
Radiobutton(root, text="SQL", padx = 2, variable=v, value=2).pack(anchor=E)

#btn=Button()
#btn.pack()
#btn["text"]="Hello, everyone!"

#def click():
#    print("You just clicked me!")

#btn["command"]=click
root.mainloop()
