import requests
import codecs
import re
import os

random = requests.get("https://gram.cerm.ru/?mod=spelling").content
with codecs.open("random.html", "wb") as f:
    f.write(random)

data = re.search(r"<div id=\"spelling_alphabetical_words_nav\">.+Я</a></div>", random.decode()) 

links = data.group().replace('<div id=\"spelling_alphabetical_words_nav\">', "").split("</a>")[:-1]

links = {link[-1]: link.replace('<a href="', "")[:-3] for link in links}

try:
    os.mkdir("Words")
except FileExistsError:
    pass 

for letter in links.keys():
    response = requests.get(links[letter]).content
    with codecs.open(f"Words/{letter}.html", "wb") as f:
        f.write(response)