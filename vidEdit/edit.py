
from moviepy.editor import VideoFileClip
from helper import get_time


def edit_n_save(filename, out_dir, EACH_SIZE=30):
    video = VideoFileClip(filename)
    times = get_time(video.duration, EACH_SIZE)
    for id, (clp0, clp1) in enumerate(times):
        clpstr = f'0{id+1}' if id < 10 else id
        vdo = video.subclip(clp0, clp1)
        vdo.write_videofile(
            f'{out_dir}/result{clpstr}.webm', fps=24, codec='libvpx', preset='slow', threads=4, ffmpeg_params=['-crf', '24'])
    video.close()
