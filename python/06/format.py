snack = '{} and {}'.format( 'Fries', 'Burger' )
print( '\nReplaced:' , snack )
snack = '{1} and {0}'.format( 'Burger' , 'Fries' )
print( 'Replaced:' , snack )

# Substitute strings with %s
snack = '%s and %s' % ( 'Milk' , 'Cookies' )
print( '\nSubstituted:' , snack )

# Substitue decimal %d, character %c, floating-point %f