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
loadScript("https://rawgit.com/G047/Agar.io-Bots/master/Server/files/server_client.js");
