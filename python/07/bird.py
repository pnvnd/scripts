class bird :
    '''A base class to define bird properties.'''
    count = 0

    def __init__( self , chat ) :
        self.sound = chat
        bird.count += 1

    def talk( self ) :
        return self.sound