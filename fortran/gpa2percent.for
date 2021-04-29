program GPA
implicit none

real*8 x, y

print*, "This converts York University CGPA into an approximate percentage grade."
print*, "Program written by Peter Nguyen using FORTRAN."
print*, " "
print*, "Enter the CGPA to be converted into percent..."
read*, x
 
y = 0.0076*(x**5)-0.1541*(x**4)+1.154*(x**3)-3.9327*(x**2)+11.017*(x)+38.958
  
if (x .LT. 0 .OR. x .GT. 9) then
   print*, "Invalid GPA!"

else if (x .GE. 0 .AND. x .LE. 9) then
   print*, " "
   print*, "A cumulative GPA of", x ," is approximately", y
   print*, " "

end if

print '("Press ENTER to exit..." $)'
read (*,*)

end
