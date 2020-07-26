from tkinter import *
import tkinter.messagebox as box

window = Tk()

window.title("Message Box Example")

label = Label(window, text = "Hello, World!")
label.pack(padx = 200, pady = 50)

btn_end = Button(window, text="Close", command=exit)
btn_end.pack(padx = 150, pady = 20)

def tog():
    if window.cget("bg") == "black":
        window.configure(bg="gray")
    else:
        window.configure(bg="black")

btn_tog = Button(window, text="Dark Mode", command=tog)
btn_tog.pack(padx = 200, pady = 10)

def dialog():
    var= box.askyesno("Message Box", "Proceed?")
    if var == 1:
        box.showinfo("Yes Box", "Proceeding...")
    else:
        box.showwarning("No Box", "Cancelling...")

btn = Button(window, text="Click", command=dialog)
btn.pack(padx = 150, pady = 50)

window.mainloop()
