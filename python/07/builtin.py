from bird import *

zola = bird( 'Beep, beep!' )

print( '\nBuilt-in Instance Attributes...' )
for attrib in dir( zola ) :
    if attrib[0] == '_' :
        print( attrib )

print( '\nInstance Dictionary...' )
for item in zola.__dict__ :
    print( item , ':' , zola.__dict__[ item ] )