def resource_path( relative_path ):
    absolute_path = os.path.abspath( __file__ )
    root_path = os.path.dirname( absolute_path )
    base_path = getattr( sys, '_MEIPASS', root_path )
    return os.path.join( base_path, relative_path )

from tkinter import *
import os

root = Tk()
logo = PhotoImage(file= resource_path('heli.png'))
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

# Windows: Run > cmd > pyinstaller --onefile --noconsole --add-binary heli.png;. gui.py
