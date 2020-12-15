
## Group Information

**Course Name:** DS 4200 S20

**Team Members:** Sidney La Fontaine, Alex Shaw, Rahul Suryadevara, Eric Downing

**Partner:** SBN


## Technology
D3.js, CSS, HTML

## The GitHub Pages Website

Make sure you publish your project to github pages, and put the URL here: https://neu-ds-4200-s20.github.io/s-l-project-sbn-9-local-food/

**Demo Video:** https://youtu.be/4no1FpRXcvI

## Setup

**Under no circumstances should you be editing files via the GitHub user interface.** Do all your edits locally after cloning the repository.

1. Clone this repository to your local machine. E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`

1. `CD` or open a terminal / command prompt window into the cloned folder.

1. Start a simple python webserver. E.g., one of these commands:
    * `python -m http.server 8000`
    * `python3 -m http.server 8000`
    * `py -m http.server 8000`
    If you are using Python 2 you will need to use `python -m SimpleHTTPServer 8000` instead, but please switch to Python 3 as [Python 2 will be sunset on 2020.01.01](https://www.python.org/doc/sunset-python-2/).

1. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`

1. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## Root Files
* `README.md` is this explanatory file for the repo.

* `index.html` contains the main website content. It includes comments surrounded by `<!--` and `-->` to help guide you through making your edits.

* `style.css` contains the CSS.

* `LICENCE` is your source code license.

## Folders
Each folder has an explanatory `README.md` file

* `data` is where you will put your data files.

* `favicons` contains the favicons for the course projects. You shouldn't change anything here.

* `files` will contain your slides (PDF) and video (MP4).

* `images` will contain your screenshots, diagrams, and photos.

* `js` will contain all JavaScript files you write.

  * `visualization.js` is the main code that builds all your visualizations. Each visualization should be built following the [Reusable Chart model](https://bost.ocks.org/mike/chart/)

* `lib` will contain any JavaScript library you use. It currently includes D3.
