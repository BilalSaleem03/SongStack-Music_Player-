
function convertSecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sseconds = Math.floor(seconds % 60);
    minutes = String(minutes).padStart(2, '0');
    sseconds = String(sseconds).padStart(2, '0');
    return `${minutes}:${sseconds}`;
}
let currentSong = new Audio();
let folderName;

async function getSong(folder) {
    let a = await fetch(`/allsongs/${folder}/`);
    let data = await a.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs;
}

async function getFolders() {
    let a = await fetch(`/allsongs/`);
    let data = await a.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let folders = [];

    for (let i = 1; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith("/")) {
            folders.push(element.href)
        }
    }
    return folders;
}

const playTrack = (track) => {
    currentSong.src = "/allsongs/" + track              //currentSong is defined globally
    currentSong.play();
    play.src = "/images/pause.svg"
    let songName = track;
    songName = songName.split("(");
    songName = songName[0];
    songName = songName.replaceAll("%20", " ");
    document.querySelector(".song-name").innerHTML = songName;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}


async function main() {
    let folders = await getFolders();
    let folderCard = document.querySelector(".card-container");
    
    for (let folder of folders) {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        folderName = folder.split("/allsongs/")[1].replace("/", "");
        folderCard.innerHTML = folderCard.innerHTML + `
        <div class="card">
        <img src="https://visualpharm.com/assets/768/Circled Play-595b40b65ba036ed117d3dd6.svg" alt="play-icon" class="play-icon">
        <img src="/FolderImages/${folderName}.jpg" alt="card" class="poster">
        <h2>${folderName}</h2>
        </div>`;
        
    }
    let songs;
    let songs_save;
    Array.from(document.querySelector(".card-container").getElementsByTagName("h2")).forEach(e => {
        e.addEventListener("click",async element => {
            folderName = e.innerHTML.trim();
            songs = await getSong(e.innerHTML.trim())
            songs_save = songs;
            let songs_list = document.querySelector("#songs-list");
            if(songs_list.innerHTML != ""){
                songs_list.innerHTML = "";
            }
            for (let song of songs) {
                let songAddress = song.split("/allsongs/")[1];
                let songName = song.split(`/${e.innerHTML.trim()}/`)[1];
                songName = songName.split("(");
                songName = songName[0];
                songName = songName.replaceAll("%20", " ");
                // let olnyName = songName.split(`/${folderName}/`)[1];
                // console.log(olnyName);
                songs_list.innerHTML = songs_list.innerHTML + `
                <div class="song-to-play">          
                    <img src="/images/music_icon.svg" alt="icon" class="music-icon">
                    <h2>${songName}</h2>
                    <p>${songAddress}</p>
                    <img src="/images/play-icon.svg" alt="" class="play-icon">
                </div>`;
            }
            Array.from(document.querySelector(".outer").getElementsByClassName("song-to-play")).forEach(e=>{
                e.addEventListener("click", element => {
                    playTrack(e.querySelector("p").innerHTML.trim())
                    let a = e.querySelector("p").innerHTML.trim();
                })
            })
        })

    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "/images/play-song.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        let time = convertSecondsToMinutes(currentSong.currentTime);
        let duration = convertSecondsToMinutes(currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${time} / ${duration}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentMoved = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentMoved + "%";
        currentSong.currentTime = ((currentSong.duration * percentMoved) / 100);
    })

    //Adding event listener to hamburber
    document.querySelector(".right .hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").style.width = "85vw";
        document.querySelector(".cross").style.visibility = "visible";
    })
    document.querySelector(".upper-box .cross").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-150%";

    })

    //ADDing event listeners to controls

    previous.addEventListener("click", () => {
        let index = songs_save.indexOf(currentSong.src);
        if ((index - 1) >= 0) {
            let songName = songs_save[index - 1].split("/allsongs/")[1];
            playTrack(songName);
        }
    })
    next.addEventListener("click", () => {
        let index = songs_save.indexOf(currentSong.src);
        if (index + 1 < songs_save.length) {
            let songName = songs_save[index + 1].split("/allsongs/")[1];
            playTrack(songName);
        }
    })

    vol_range.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

}

main();

