# Install Imagemagick Display (legacy)
from moviepy.editor import *
from moviepy.video.tools.subtitles import SubtitlesClip

generator = lambda txt: TextClip(txt, font='Comic Sans MS', fontsize=32, color='white')
subtitles = SubtitlesClip("movie_002.srt", generator)

video = VideoFileClip("movie_002.mp4")
result = CompositeVideoClip([video, subtitles.set_pos(('center',480))])

result.write_videofile("movie_002_subbed.mp4", fps=video.fps, temp_audiofile="temp-audio.m4a", remove_temp=True, codec="libx264", audio_codec="aac")

# Video: MPEG4 Video (H264) 960x544 23.976fps 2142kbps [V: Video Media Handler [eng] (h264 high L4.0, yuv420p, 960x544, 2142 kb/s)]
# Audio: AAC 48000Hz stereo 128kbps [A: Sound Media Handler [eng] (aac lc, 48000 Hz, stereo, 128 kb/s)]
