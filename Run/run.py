with open("./proxies") as f:
    proxies = f.readlines()
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time
import os
import random
import threading
mem_gib = int(input("How many bots do you want to spawn? (too many will crash your pc/vps): "))
print "\nOkay good, now  check the nodejs console; You should see 'Browser Connected UUID: XSAGHASGga' If this doesnt show two things could of happened, There patched OR You need to update your proxies :)"


def bot():
    try:
        chromedriver = "chromedriver"
        os.environ["webdriver.chrome.driver"] = chromedriver
        options = Options()
        options.add_extension('loader.crx')
        options.add_argument('--proxy-server='+random.choice(proxies))
        driver = webdriver.Chrome(chrome_options=options)
        driver.set_window_size(1, 1)
        driver.get("http://agar.io")
        #time.sleep(30)  #slow proxies
    except:
        bot()
print "Opening browsers"
for a in range(mem_gib /  2):
     t = threading.Thread(target=bot)
     t.start()
     time.sleep(0.2)
print "Waiting at least 30 seconds for all the proxies to load"
time.sleep(30)
print "Assuming some of the proxies managed to connect, if you don't see 'Browser Connected UUID: GDSAeageAEag' at least a few times on the nodejs console you should update your proxies :)"
while(1):
    time.sleep(30)
