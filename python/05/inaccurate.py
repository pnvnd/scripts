item = 0.70
rate = 1.05

tax = item * rate
total = item + tax

print("\nUsing 2 decimal places:")
print( 'Item:\t' , '%.2f' % item )
print( 'Tax:\t' , '%.2f' % tax )
print( 'Total:\t' , '%.2f' % total )

print("\nUsing 20 decimal places:")
print( 'Item:\t' , '%.20f' % item )
print( 'Tax:\t' , '%.20f' % tax )
print( 'Total:\t' , '%.20f' % total )

from decimal import *

item2 = Decimal( 0.70 )
rate2 = Decimal( 1.05 )

tax2 = item2 * rate2
total2 = item2 + tax2

print("\nUsing 2 decimal places with Decimal():")
print( 'Item2:\t' , '%.2f' % item2 )
print( 'Tax2:\t' , '%.2f' % tax2 )
print( 'Total2:\t' , '%.2f' % total2 )

print("\nUsing 20 decimal places with Decimal():")
print( 'Item2:\t' , '%.20f' % item2 )
print( 'Tax2:\t' , '%.20f' % tax2 )
print( 'Total2:\t' , '%.20f' % total2 )