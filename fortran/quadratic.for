program Quadratic
implicit none

real*8 a, b, c, d
real*8 root1, root2
integer*1 count
 

print*, "This program solves ax^2 + bx + c = 0"
print*, "Enter the coefficients a, b, and c separated by commas..."
read*, a, b, c
 
d = b**2 - 4.* a * c
 

if (d .GT. 0.) then
   root1 = (-b + sqrt(d)) / (2. * a)
   root2 = (-b - sqrt(d)) / (2. * a)
   count = 2

else if (d .LT. 0.) then
   count = 0

else
   root1 = -b / (2. * a)
   count = 1

end if
 

if (count .EQ. 2) then
   write(*,20) " Equation has two roots: ", root1, ", ", root2
else if (count .EQ. 1) then
   write(*,20) " Equation has one root: ", root1
else
   write(*,20) " Equation has no real roots!"
end if
20 format(1x, A, F10.4, A, F10.4)

print '("Press ENTER to exit..." $)'
read (*,*)

end
