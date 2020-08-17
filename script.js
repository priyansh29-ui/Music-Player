let eq,canvas,ctx,previousBtn,nextBtn,playBtn,currentSong,currentSongElem,audioContext,analyzer,source,containerBackCover,equalizerBackCover,songinfo,artist,visualizerId,seekElem,progressBar,seekId;
//Get DOM elements for reference
window.addEventListener("DOMContentLoaded",()=>{
    const songs = [
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
            songURL:"https://cors-anywhere.herokuapp.com/https://bestmusic.uz/play/dl/alekseev-snov-oskolki_(www.bestmusic.uz).mp3",
            imgURL:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR_4idQnhygppqaPZww3vLkZY1XNak7ohPSl3KlYpDfnvJUK2bb",
            name:"Snov Oskolki",
            artist:"Alekseev"
        },
        {
            songURL:"https://cors-anywhere.herokuapp.com/http://bestmusic.uz/play/dl/serebro-slomana_(www.bestmusic.uz).mp3",
            imgURL:"http://d2lubch9d26anb.cloudfront.net/cdn/farfuture/ydf8G66JSDQrLe3gkeBj24nMcq0GyJplTqLkoRKtNZo/mtime:1481005992/sites/default/files/artworks-000180273517-wbenvu-t500x500.jpg",
            name:"Slomana",
            artist:"Serebro"
        }
        ];
        
        //Pre load images into array - Caching images
        //This is for quicker loading of images while changing songs reduce HTTP requests
        songs.map((song) => {
            const img = new Image();
            img.src = song.imgURL;
        });
        
 currentSong = songs[0];
 eq = document.querySelector('.equalizer');
 canvas = document.getElementById('equalizer_render');
 previousBtn = document.getElementById('previousBtn');
 nextBtn = document.getElementById('nextBtn');
 playBtn = document.getElementById('playBtn');
 containerBackCover = document.querySelector('.container');
 equalizerBackCover = document.querySelector('.equalizer');
 songinfo = document.querySelector(".songinfo");
 seekElem = document.querySelector(".seek");
 progressBar = document.querySelector(".progressBar");
ctx = canvas.getContext("2d");

const setSongInfo = ()=>{
    songinfo.innerText = `${currentSong.artist} - ${currentSong.name}`;
}
 // drawCanvas to match the container width and height
 const initCanvas = (()=>{
     canvas.width = eq.clientWidth;
     canvas.height = eq.clientHeight;
 })();

 const initVisualizer = ()=> {
     if(!source){
        source = audioContext.createMediaElementSource(currentSongElem);
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
     }
      frameLooper();
      seekLooper();
 };

 const seekLooper = ()=>{
     seekId = window.requestAnimationFrame(seekLooper);
     let newSize = currentSongElem.currentTime*eq.clientWidth/currentSongElem.duration;
    seekElem.style.width = newSize +'px';
 }

 const frameLooper = () =>{
     visualizerId = window.requestAnimationFrame(frameLooper);
     const fbc_array = new Uint8Array(analyzer.frequencyBinCount);
     analyzer.getByteFrequencyData(fbc_array);
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle = "#00CCFF";
     const bars = 100;
     const barWidth = canvas.width/100;
     for (var i =0;i<bars;i++){
         let barX = i*barWidth;
         let barHeight = -(fbc_array[i]/2);
         ctx.fillRect(barX,canvas.height,barWidth,barHeight);
     }
 };

 const setCover = () => {
     containerBackCover.style.backgroundImage = `url(${currentSong.imgURL})`;
     equalizerBackCover.style.backgroundImage = `url(${currentSong.imgURL})`;
 }

const setControls = ()=>{
    if(currentSongElem.paused){
    document.getElementsByClassName('play')[0].style.display = "block";
    document.getElementsByClassName('pause')[0].style.display = "none";
}else if(!currentSong.paused){
    document.getElementsByClassName('play')[0].style.display = "none";
    document.getElementsByClassName('pause')[0].style.display = "flex";
}
}

 const loadSong = () => {
    setSongInfo();
    currentSongElem.setAttribute('src',currentSong.songURL);
    seekElem.style.width = 0+'px';
    setControls();
    setCover();
    currentSongElem.load();
};


 const createCurrentSongElem = (()=>{
     currentSongElem = new Audio();
     currentSongElem.crossOrigin = "anonymous";
     currentSongElem.src = currentSong.songURL;
     loadSong();
 })();
 

const reDrawCanvas = ()=>{
    canvas.width = eq.clientWidth;
    canvas.height = eq.clientHeight;
};

const playCurrentSong = ()=>{
    if(!audioContext && !analyzer){
        audioContext = new (window.AudioContext||window.webkitAudioContext)();
        analyzer = audioContext.createAnalyser();
    }
window.cancelAnimationFrame(visualizerId);
window.cancelAnimationFrame(seekId);
if(currentSongElem.paused) {
    currentSongElem.play();
    initVisualizer();
} else{
    currentSongElem.pause();
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
setControls();
};

const goToPrevSong = () =>{
    window.cancelAnimationFrame(visualizerId);
    window.cancelAnimationFrame(seekId);
    const currentIndex = songs.indexOf(currentSong);
    const lastIndex = songs.length-1;
    if(currentIndex == 0) {
        currentSong = songs[lastIndex];
    }else {
        currentSong = songs[currentIndex - 1];
    }
    loadSong();
    };

    const goToNextSong = () => {
    window.cancelAnimationFrame(visualizerId);
    window.cancelAnimationFrame(seekId);
    const currentIndex = songs.indexOf(currentSong);
    const lastIndex = songs.length - 1;
    if(currentIndex == lastIndex){
        currentSong = songs[0]
    }else {
        currentSong = songs[currentIndex + 1];
    }
    loadSong();
    };

window.addEventListener("resize",()=>{
reDrawCanvas();
});

playBtn.addEventListener("click",()=>{
    playCurrentSong();
});
previousBtn.addEventListener("click",()=>{
    goToPrevSong();
});
nextBtn.addEventListener("click",()=>{
    goToNextSong();
});

let dragstart;
seekElem.addEventListener("touchstart",(event)=>{
   //cancel animation for seek and visualizer
    window.cancelAnimationFrame(seekId);
   window.cancelAnimationFrame(visualizerId);
   currentSongElem.pause();
    setControls();
   dragstart = event.touches[0].pageX;
},{passive:true});

seekElem.addEventListener("touchmove",(event)=>{
    let dragmove = event.touches[0].pageX;
    if(dragmove > dragstart){
         seekElem.style.width = parseFloat(seekElem.style.width,10) + 1 +'px';
    }else {
        seekElem.style.width = parseFloat(seekElem.style.width,10) - 1 +'px';
    }
},{passive:true});

seekElem.addEventListener("touchend",(event)=>{
    const seekPosition= parseFloat(seekElem.offsetWidth,10);
    const totalLength = parseFloat(progressBar.offsetWidth,10);
    const newTime = (seekPosition/totalLength)*currentSongElem.duration;
    currentSongElem.currentTime = newTime;
    playCurrentSong();
});

currentSongElem.addEventListener("ended",()=>{
    currentSongElem.currentTime = 0;
    goToNextSong();
    playCurrentSong();
});
});
alert("An audio player built using vanilla JS.\n Please wait for a while if music does not play after pressing play.\nIf found an issue leave a comment else leave a like..\n v1. Added a seek for touch screen devices.");

