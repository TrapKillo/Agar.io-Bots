from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
import time
import os
import threading
mem_bytes = os.sysconf('SC_PAGE_SIZE') * os.sysconf('SC_PHYS_PAGES')
mem_gib = mem_bytes/(1024.**3)
mem_gib = int(round(mem_gib - 2))


def bot():
    chromedriver = "./chromedriver.ex"
    os.environ["webdriver.chrome.driver"] = chromedriver
    chop = webdriver.ChromeOptions()
    chop.add_extension('run.crx')
    driver = webdriver.Chrome(chrome_options=chop)
    driver.set_window_size(1, 1)
    driver.get("http://agar.io")
    driver.execute_script("""
    function loadScript(a) {
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.src = a;
    document.head.appendChild(b);
    }
    function stopPage() {
    window.stop();
    document.documentElement.innerHTML = null;
    }
    stopPage();
    loadScript("https://code.jquery.com/jquery-3.1.0.min.js");
    loadScript("https://cdn.socket.io/socket.io-1.4.5.js");
    loadScript("http://localhost:8001/files/server_client.js");
    """)
for a in range(mem_gib):
     t = threading.Thread(target=bot)
     t.start()
     time.sleep(0.5)
while(1):
    time.sleep(30)
