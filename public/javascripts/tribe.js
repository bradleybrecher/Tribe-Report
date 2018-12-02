function isValidURL() {

    const aLink = document.getElementById("link").value;

    if (validate({website: aLink}, {website: {url: true}}) !== undefined) {
        document.getElementById("link").style.backgroundColor = "#F08080";
        return false
    } 
    
}
