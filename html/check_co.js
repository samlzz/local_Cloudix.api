function check_co() {
    if(navigator.onLine) {
        console.log("Browser is online");
    } else {
        console.log("Browser is offline");
    }
};

time_in_sec = 5;    //TODO the time in second between two check of the connexion
setInterval(check_co, time_in_sec*1000);
