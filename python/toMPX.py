# pip install pymovie
import moviepy.editor as mp
import os

# Convert GIF to MP4
def toMp4(file):
    file_name, file_extension = os.path.splitext(file)

    clip = mp.VideoFileClip(file_name + file_extension)
    clip.write_videofile(file_name + ".mp4")

    print("Converted: " + file_name + ".mp4")

# Convert MP4 to MP3 or WAV
def toMp3(file):
    file_name, file_extension = os.path.splitext(file)
    
    clip = mp.VideoFileClip(file_name + file_extension)
    clip.audio.write_audiofile(file_name + ".mp3")

    print("Converted: " + file_name + ".mp3")
