var isDrawerOpen = false,
    isNavOpen = false,
    mediaPlayer,
    audioSource,
    isPlaying = false,
    bufferingStats,
    bottomBar,
    progressTimeDuration,
    songListDuration,
    isReady = false,
    bottomProgress,
    drawerCurrentTime,
    drawerSongDuration,
    drawerBar,
    dawerProgress,
    isKorean=false,
    baseUrl = "https://priyanshagrawal29.github.io/Music/",
    accentColorAr = [
        '#ff4b66',
        '#62ff6e',
        '#ffb762',
        '#3444ff',
        '#16e0aa',
        '#8f1fff',
        '#70de00',
        '#000000'
    ];
var song, english = [
    {
    songURL:"media/Lehanga.mp3",
    imgURL:"media/Lehanga.jpeg",
    name:"Lehanga",
    artist:"Jass Manak"
    },
    { 
    songURL:"media/Prada.mp3",
    imgURL:"media/Prada.jpeg",
    name:"Prada",
    artist:"Jass Manak"
    },
    {
    songURL:"media/Aaj.mp3",
    imgURL:"media/Aaj.jpeg", 
    name:"Aaj din chadeya",
    artist:"Rahat fateli khan"
    }, 
    { 
        songURL:"media/Nira ishq.mp3", 
        imgURL:"media/Nira ishq.jpeg",
        name:"Nira ishq",
        artist:"Guri"}
    }
var korean = [
    {
    songURL:"media/Lehanga.mp3",
    imgURL:"media/Lehanga.jpeg",
    name:"Lehanga",
    artist:"Jass Manak"
    },
    { 
    songURL:"media/Prada.mp3",
    imgURL:"media/Prada.jpeg",
    name:"Prada",
    artist:"Jass Manak"
    },
    {
    songURL:"media/Aaj.mp3",
    imgURL:"media/Aaj.jpeg", 
    name:"Aaj din chadeya",
    artist:"Rahat fateli khan"
    }, 
        {
        name:"",
        singer:"",
        duration:"",
        url:"",
        albumArt:""
    }
];



    {
        name:"",
        singer:"",
        duration:"",
        url:"",
        albumArt:""
    }
];

var currentProfile = {
    name:"",
    singer:"",
    duration:"",
    url:"",
    albumArt:"",
    id:0,
    accentColor:"#8f1fff"
};

window.onload = function(){

    mediaPlayer = document.getElementById('media-player'),
        audioSource = document.getElementById('audio-source');

    document.getElementById("loading").style.display="none";

    mediaPlayer.addEventListener("progress", function() {
        if(isReady)
            bufferingStats.style.opacity=1;

        var bufferedEnd = mediaPlayer.buffered.end(mediaPlayer.buffered.length - 1);
        var mduration =  mediaPlayer.duration;
        if (mduration > 0) {
            document.getElementById('bufferedBar').style.width = ((bufferedEnd / mduration)*100) + "%";
            document.getElementById('drawerBufferedBar').style.width = ((bufferedEnd / mduration)*100) + "%";
        }

    });

    $('#drawerStopButton').click(function(){
        mediaPlayer.pause();
        mediaPlayer.currentTime = 0;
        isPlaying = false;
        $('#play-btn').text('play_arrow');
        $('#drawerPlay').text('play_arrow');
    });

    document.getElementById("toast")
        .addEventListener("webkitAnimationEnd", function(){
        toast.style.animation="none";
    });

    changeTheme(0);

};

$(document).ready(function(){

    $(".main-container").css("height",window.innerHeight+"px");

    generateElements(false);
    setCurrentProfile(0);

    $('.nav').click(function(e){
        e.stopPropagation();
    });

    mediaPlayer = document.getElementById('media-player'),
        audioSource = document.getElementById('audio-source'),
        bufferingStats = document.querySelector('.bufferingStats'),
        bottomBar = document.getElementById('bottomBar'),
        progressTimeDuration = document.getElementById('progressTimeDuration'),
        songListDuration = document.getElementsByClassName('song-list-duration'),
        bottomProgress = document.getElementById('bottomProgress'),
        drawerCurrentTime = document.getElementById('drawerCurrentTime'),
        drawerSongDuration = document.getElementById('drawerSongDuration'),
        drawerBar = document.getElementById('drawerBar'),
        dawerProgress = document.getElementById('dawerProgress');

    mediaPlayer.addEventListener('timeupdate', function() {
        writeProgressAndDuration();
        bufferingStats.style.opacity=0;
    });

    bottomProgress.addEventListener('click', function(e) {

        var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
        var jumpTime = clickPosition * mediaPlayer.duration;

        mediaPlayer.currentTime = jumpTime;

        if(!isPlaying)
            playPause();

    });

    dawerProgress.addEventListener('click', function(e) {
        var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
        var jumpTime = clickPosition * mediaPlayer.duration;

        mediaPlayer.currentTime = jumpTime;

        if(!isPlaying)
            playPause();

    });

    function writeProgressAndDuration(){
        var time = parseInt(mediaPlayer.currentTime, 10),
            songDuration = parseInt(mediaPlayer.duration, 10),
            currentSec=0,
            totalSec=0,
            prog;

        prog = parseInt(((time / songDuration) * 100), 10) + "%";
        bottomBar.style.width = prog;
        drawerBar.style.width = prog;

        var minutes = Math.floor(time / 60),
            seconds = time - minutes * 60,
            songDurationMinutes = Math.floor(songDuration / 60),
            songDurationSeconds = Math.floor(songDuration - songDurationMinutes * 60);

        currentSec = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
        totalSec = str_pad_left(songDurationMinutes,'0',2)+':'+str_pad_left(songDurationSeconds,'0',2);

        progressTimeDuration.textContent = currentSec+' / '+totalSec;

        songListDuration[currentProfile.id].textContent = currentSec;
        drawerSongDuration.textContent = totalSec;

        drawerCurrentTime.textContent = currentSec;

        function str_pad_left(string,pad,length) {
            return (new Array(length+1).join(pad)+string).slice(-length);
        }
    }

    $("#favorite").click(function(){
        if(this.textContent=='favorite')
            this.textContent='favorite_border';
        else{
            this.textContent='favorite';
            showToast("Favorited");
        }
    });

    $("#repeat").click(function(){
        if(this.textContent=='repeat'){
            this.textContent='repeat_one';
            showToast("Repeat One");
        }else{
            this.textContent='repeat';
            showToast("Repeat All");
        }

    });

});

function changeTheme(id){

    document.documentElement.style.setProperty('--accent-color', accentColorAr[id]);
    currentProfile.accentColor = accentColorAr[id];
    if(id==7){
        currentProfile.accentColor = "#000000";
        showToast("Expermental Dark");
    }
    var card = document.getElementsByClassName('card');
    songListDuration[currentProfile.id].style.color = currentProfile.accentColor;
    if(id==7)
        card[currentProfile.id].style.color = "#ffffff";
    else
        card[currentProfile.id].style.color = currentProfile.accentColor;

    if(isKorean){
        $('.left-pannel__anime').css('color',currentProfile.accentColor);
    }else{
        $('.left-pannel__favorite').css('color',currentProfile.accentColor);
    }

}

function navHandler(){

    if(isNavOpen){
        closeNav();
    }else{
        openNav();
    }

    function openNav(){
        $('.nav-container').show();
        $('.nav').animate({width: "75vw"}, 700, function(){
            $('.nav p').show();
            $('.themes').css('display', 'flex');
            setTimeout(function(){
                $('.theme').css('transform', 'scale(1)');
            },100);
            isNavOpen = true;
        });

    }

    function closeNav(){
        $('.nav p').hide();
        $('.themes').hide();
        $('.theme').css('transform', 'scale(0)');
        $('.nav').animate({width: "0vw"}, 700, function(){
            $('.nav-container').hide();
            isNavOpen = false;
        });
    }
}

function drawerHandler(){

    if(isDrawerOpen){
        closeDrawer();
    }else{
        openDrawer();
    }

    function openDrawer(){

        $('.bottom-drawer').show();
        $('#drawerSongName').text(currentProfile.name);
        $('#drawerSingerName').text(currentProfile.singer); 
        $('#songAlbumArt').css("background-image", "url("+baseUrl+currentProfile.albumArt + ")");
        $('.bottom-pannel .bottom__up-arrow').css('transform', 'rotate(180deg)');
        $('.drawer-holder').animate({height: "60vh"}, 1000, function(){

            $('.bottom-drawer .bottom__up-arrow').css('transform', 'rotate(180deg)');
            $('.column').css('display', 'flex');
            isDrawerOpen = true; 
        });

    }

    function closeDrawer(){
        $('.column').hide();
        $('.drawer-holder').animate({height: "12vh"}, 1000, function(){
            isDrawerOpen=false; 
            $('.bottom-drawer').hide();
            $('.bottom-pannel .bottom__up-arrow').css('transform', 'rotate(0deg)');
            $('.bottom-drawer .bottom__up-arrow').css('transform', 'rotate(0deg)');
        });
    }

}

function generateElements(ko){

    var cards = "", songList="";

    $('.cards-holder').html("");
    $('.list-view').html("");

    if(ko){
        songs = korean;
        $('.left-pannel__anime').text('_K-POP');
        $('.left-pannel__anime').css('color',currentProfile.accentColor);
        $('.left-pannel__favorite').text('English');
        $('.left-pannel__favorite').css('color',"black");
    }else{
        songs = english;
        $('.left-pannel__favorite').text('_English');
        $('.left-pannel__favorite').css('color',currentProfile.accentColor);
        $('.left-pannel__anime').text('K-POP');
        $('.left-pannel__anime').css('color',"black");
    }

    for(var i=0; i<songs.length; i++){

        cards = cards+`<div class="card" onclick="playSong(`+i+`);" style="background-image: url(`+
            baseUrl+songs[i].albumArt
            +`)">
<div class="card__song-info">
<div class="card__song-artist-title">
<div class="card__song-info__name">
`+songs[i].name+`
</div>

<div class="card__song-info__singer">
`+songs[i].singer+`
</div>
</div>

</div>
</div>`;

    }

    $('.cards-holder').html(cards);

    for(var i=0; i<songs.length-1; i++){
        songList = songList + `<div class="song-list" onclick="playSong(`+i+`)">
<div class="song-list__info">
<img src="`+baseUrl+songs[i].albumArt+`">
<div>
<div class="song-list__name">`+songs[i].name+`</div>
<div id="songListPlayedTime">`+songs[i].singer+`</div>
</div>
</div>
<div id="songListDuration" class="song-list-duration">`+songs[i].duration+`</div>
</div>`
    }

    $('.list-view').html(songList);

    this.isKorean = ko;

}

function playSong(songId, checkPause){

    var card = document.getElementsByClassName('card');

    if(checkPause == undefined)
        if(currentProfile.name == songs[songId].name){
            songListDuration[songId].style.color = currentProfile.accentColor;
            card[songId].style.color = currentProfile.accentColor;
            playPause();
            return;
        }
    if(currentProfile.id != songId){
        songListDuration[songId].style.color = currentProfile.accentColor;
        songListDuration[currentProfile.id].style.color = "grey";
        songListDuration[currentProfile.id].textContent = currentProfile.duration;
        card[songId].style.color = currentProfile.accentColor;
        card[currentProfile.id].style.color = "#ffffff";
    }
    setCurrentProfile(songId);
    audioSource.src = baseUrl+currentProfile.url;
    $("#bottomSongName").text(currentProfile.name);
    $('#bottomSingerName').text(currentProfile.singer);
    mediaPlayer.load();
    mediaPlayer.play();
    $('#play-btn').text('pause');
    $('#drawerPlay').text('pause');
    isPlaying = true;
    isReady = true;
}

function playPause(){
    isReady = true;
    if(!isPlaying){
        isPlaying = true;
        mediaPlayer.play();
        $('#play-btn').text('pause');
        $('#drawerPlay').text('pause');
    }else{
        isPlaying = false;
        mediaPlayer.pause();
        $('#play-btn').text('play_arrow');
        $('#drawerPlay').text('play_arrow');
    }

    var card = document.getElementsByClassName('card');
    songListDuration[currentProfile.id].style.color = currentProfile.accentColor;
    card[currentProfile.id].style.color = currentProfile.accentColor;
}

window.onerror=function(){
    console.error=null;
    return true;
};

function nextSong(){
    var songId = 0;
    if(currentProfile.id == songs.length-2)
        songId = 0;
    else
        songId=currentProfile.id+1;
    playSong(songId, true);
    setCurrentProfile(songId);
    $('#drawerSongName').text(currentProfile.name);
    $('#drawerSingerName').text(currentProfile.singer); 
    $('#songAlbumArt').css("background-image", "url("+baseUrl+currentProfile.albumArt + ")");

}

function prevSong(){
    var songId = 0;
    if(currentProfile.id == 0)
        songId = songs.length-2;
    else
        songId=currentProfile.id-1;
    playSong(songId, true);
    setCurrentProfile(songId);
    $('#drawerSongName').text(currentProfile.name);
    $('#drawerSingerName').text(currentProfile.singer);
    $('#songAlbumArt').css("background-image", "url("+baseUrl+currentProfile.albumArt + ")");
}

function showToast(text){
    var toast = document.getElementById("toast");
    document.getElementById("toastText").textContent = text;
    toast.style.animation = "fade 2s";
    toast.style.anmationFillMode = "forwards";
}

function setCurrentProfile(id){
    currentProfile.id = id;
    currentProfile.name = songs[id].name;
    currentProfile.singer = songs[id].singer;
    currentProfile.duration = songs[id].duration;
    currentProfile.url = songs[id].url;
    currentProfile.albumArt = songs[id].albumArt;
}
