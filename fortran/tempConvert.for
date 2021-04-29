program Convert
implicit none

real*8 tempC, tempF
integer*2 ZERO_SHIFT, CTYPE


print*, "Convert Celcius to Fahrenheit, press 1 and ENTER"
print*, "or"
print*, "Convert Fahrenheit to Celcius, press 2 and ENTER."
read*, CTYPE

if (CTYPE .eq. 2) then
	print*, "Enter the temperature in Fahrenheit ..."
	read*, tempF
	tempC = 5./9. * (tempF - 32)
	print '("The corresponding Centigrade temperature is ")'
	print*, tempC, " degrees."

else if (CTYPE .eq. 1) then
	print*, "Enter the temperature in Celcius ..."
	read*, tempC
	tempF = (9./5. * tempC) + 32
	print '("The corresponding Fahrenheit temperature is ")'
	print*, tempF, " degrees."
end if

print '("Press ENTER to exit..." $)'
read (*,*)

end

