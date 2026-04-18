import requests
import codecs
import re

random = requests.get("https://gram.cerm.ru/?mod=spelling").content
with codecs.open("random.html", "wb") as f:
    f.write(random)

links = re.search(r"<div id=\"spelling_alphabetical_words_nav\">.+Я</a></div>", random.decode()) #.replace('<div id=\"spelling_alphabetical_words_nav\">', "")) re.findall(r"<a href=\"https://gram.cerm.ru/spelling/.+\">.</a>", 

links = links.group()

print(len(links))
print(links)
