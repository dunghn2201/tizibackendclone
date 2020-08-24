module.exports = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = month >= 10 ? month : `0${month}`;
    var date = now.getDate();
    date = date >=10 ? date : `0${date}`;
    var hours = now.getHours();
    hours = hours >=10 ? hours :`0${hours}`;
    var minutes = now.getMinutes();
    minutes = minutes >= 10 ? minutes : `0${minutes}`;
    var secounds = now.getSeconds();
    secounds = secounds >= 10 ? secounds : `0${secounds}`;
    return `${year}-${month}-${date} ${hours}:${minutes}:${secounds}`;
}