from datetime import *

today = datetime.today()

print( 'Today Is:' , today )

# the \ backslash character is used in this loop to allow a statement to continue 
# on the next line without causing an error
for attr in \
[ 'year','month','day','hour','minute','second','microsecond' ] :
    print( attr , ':\t' , getattr( today , attr ) )

print( ' Time:' , today.hour , ':' , today.minute , sep = '' )

day = today.strftime( '%A' )
month = today.strftime( '%B' )
year = today.strftime("%Y")

print( 'Date:', day, month, today.day, ",", year )