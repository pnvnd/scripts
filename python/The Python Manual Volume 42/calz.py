import calendar

# cal = calendar.TextCalendar(calendar.SUNDAY)
# for i in cal.itermonthdays(2020,7):
#     print(i)

cal=open("C:\\Users\\Peter\\Desktop\\cal.html", "w")
c=calendar.HTMLCalendar(calendar.SUNDAY)
cal.write(c.formatyear(2020))
cal.close()
