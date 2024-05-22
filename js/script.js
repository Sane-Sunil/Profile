document.addEventListener("DOMContentLoaded", function(){
    document.body.style.backgroundImage = "none";
    document.getElementById("body").innerHTML = `<p id='redirect'>Click <a href="profile.html">Redirect</a> if it doesn't automatically redirect</p>`;
    setTimeout(function(){
        document.head.innerHTML = `<meta http-equiv="refresh" content="0; url=profile.html" />`
    }, 1000);
    
});