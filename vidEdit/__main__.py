#!venv/bin/python3

import os
from typer import Typer
from subprocess import call
from edit import edit_n_save

this_path = os.path.dirname(os.path.realpath(__file__))
app = Typer()


@app.command()
def run(filepath: str, outdir: str, vidsize: int = 30):
    if not os.path.isfile(filepath):
        print('[-] File Does Not Exist!')
        return
    if os.path.exists(outdir):
        try:
            os.rmdir(outdir)
        except OSError:
            print('[-] Provide a empty directory name as output directory!')
            return
    # file_path = os.path.realpath(filepath)
    # out_dir = os.path.realpath(outdir)
    os.mkdir(outdir)
    edit_n_save(filepath, outdir, vidsize)
    call(['sh', f'{this_path}make_archive.sh', outdir])


if __name__ == '__main__':
    app()
