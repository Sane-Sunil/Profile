document.addEventListener("DOMContentLoaded", function(){
    
    // ~####    Random    ####~ \\

    // let len = ab.length();
    // let ab = ['profile1.html', 'profile2.html', 'profile3.html'];
    // let rand = Math.floor(Math.random() * 3);
    // let randhtml = ab[rand];
    // document.body.style.backgroundImage = "none";
    // document.getElementById("body").innerHTML = `<p id='redirect'>Click <a href="profile.html">Redirect</a> if it doesn't automatically redirect</p>`;
    // setTimeout(function(){
    //     document.head.innerHTML = `<meta http-equiv="refresh" content="0; url=${randhtml}" />`
    // }, 1000);

    // ~####    Simple    ####~ \\

    document.body.style.backgroundImage = "none";
    document.getElementById("body").innerHTML = `<p id='redirect'>Click <a href="profile.html">Redirect</a> if it doesn't automatically redirect</p>`;
    setTimeout(function(){
        document.head.innerHTML = `<meta http-equiv="refresh" content="0; url=profile1.html" />`
    }, 1000);
    
});