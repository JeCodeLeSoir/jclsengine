import os
from pathlib import Path
waitValue = 1
print("Start compiling...")
clearfolder = [
    "../GithubPage"
]


def ResolvePath(path):
    _path = str(Path(path).resolve())
    return "\"" + _path + "\""


commands = [
    "mkdir " + ResolvePath("../GithubPage"),
    "mkdir " + ResolvePath("../GithubPage/dist"),
    "mkdir " + ResolvePath("../GithubPage/assets"),
    "xcopy " +
    ResolvePath("node_modules/jclsengine/dist/*.js") +
    " \"../GithubPage/dist\" /sy",
    "copy " + ResolvePath("index_for_page.html") + " \"../GithubPage\" /y",
    "copy " + ResolvePath("game.css") + " \"../GithubPage\" /y",
    "xcopy " + ResolvePath("assets/*.*") + " \"../GithubPage/assets\" /sy",
    "xcopy " + ResolvePath("dist/*.js") + " \"../GithubPage/dist\" /sy",
    "rename " +
    ResolvePath("../GithubPage/index_for_page.html") + " index.html"
]

for i in clearfolder:
    os.system(f"sleep {waitValue}")
    print(f"Clearing {i}...")
    os.system(f"rm -rf {i}")

os.system(f"sleep {waitValue}")

for i in commands:
    os.system(f"sleep {waitValue}")
    print(f"Running {i}...")
    os.system(i)
