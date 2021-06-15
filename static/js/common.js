//cname에 해당하는 cookie값 가져오기 
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(unescape(document.cookie));
    var ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}
  
//cookie 값 및 지속 시간 설정 
function setCookieHour(name, value, hours) {   
    var now = new Date();
    var time = now.getTime();

    time += 3600 * 1000 * hours;
    now.setTime(time);

    document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + now.toUTCString() + ";"   
}