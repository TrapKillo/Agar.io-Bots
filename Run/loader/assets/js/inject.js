var inject_ready = function(callback) {
    if ((document.head || document.documentElement) !== null && (document.head || document.documentElement) !== undefined) {
        callback();
    } else {
        window.setTimeout(function() {
            inject_ready(callback);
        }, 50);
    }
};
 
inject_ready(function() {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('assets/js/script.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement)
    .appendChild(script);
});
