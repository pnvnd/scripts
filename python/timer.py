from time import *

start_timer = time()

struct = localtime( start_timer )

print( '\nStarting Countdown At:' , strftime( '%X' , struct ) )

i = 10
while i > -1 :
    print( i )
    i -= 1
    sleep( 1 ) 
    # the sleep() method may be a floating point number to indicate a more precise sleep pause time

end_timer = time()
difference = round( end_timer - start_timer )

print( '\nRuntime:' , difference , 'Seconds' )