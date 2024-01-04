from tkinter import *
import tkinter.messagebox as box

window = Tk()
window.title("Convert Temperature")
# window.iconbitmap(default='favicon.ico')
lab = Label(window, text='This program converts Celcius to Fahrenheit.')
lab.pack()

frame = Frame(window)
entry = Entry(frame)

def dialog():
    tempC = float(entry.get())
    tempF = 9/5*float(tempC)+32
    box.showinfo("Conversion", str(tempC) + "°C is " + str(tempF) + "°F.")

btn = Button(frame, text="Enter °C", command=dialog)
btn.pack(side=RIGHT, padx=5)
entry.pack(side=LEFT)
frame.pack(padx=20, pady=20)

window.mainloop()
