import os, shutil, time

timestamp=str(time.strftime("[%Y-%m-%d_%H-%M]"))
root_src_dir = r"C:\\temp\\" # Path to the source directory
root_dst_dir = "C:\\backup\\" + timestamp + "_" # Path to the destination directory

for src_dir, dirs, files in os.walk(root_src_dir):
    dst_dir = src_dir.replace(root_src_dir, root_dst_dir, 1)
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)
    for file_ in files:
        src_file = os.path.join(src_dir, file_)
        dst_file = os.path.join(dst_dir, file_)
        if os.path.exists(dst_file):
            os.remove(dst_file)
        shutil.copy(src_file, dst_dir)
        
print(">>>>>>>>>> Backup Complete <<<<<<<<<<")