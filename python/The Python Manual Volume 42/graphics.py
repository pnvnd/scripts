import pygame
pygame.init()

img = pygame.image.load("\\peter_linkedin.png")

white = (255, 255, 255)
w = 1920
h = 1080
screen = pygame.display.set_mode((w, h))
screen.fill((white))

screen.fill((white))
screen.blit(img, (0,0))
pygame.display.flip()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()