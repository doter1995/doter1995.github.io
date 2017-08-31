    window.onscroll = function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var thead = document.getElementById("thead");
        var table = document.getElementsByTagName("table");
        console.log(t)
        if (t>= 270) {
            console.log("aaaa")
            thead.style.position='fixed'
            thead.style.top='3.2rem'
        } else {
            console.log("bbb")
            thead.style.position='static'
        }
    }