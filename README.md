

```markdown
# SongStack

Welcome to SongStack, a web application for streaming songs. This project allows users to browse song folders, select songs, and control playback through an intuitive web interface.

## Website URL

Visit the website at [https://songstack.freewebhostmost.com/](https://songstack.freewebhostmost.com/)

## Project Structure

The project consists of the following key sections:

- **Utility Functions**
- **Global Variables**
- **Fetch Functions**
- **Player Functions**
- **Main Function**
- **Event Listeners**

## Utility Functions

These functions provide basic utilities for the application, such as converting seconds to minutes.

```javascript
/**
 * Convert seconds to minutes and seconds (mm:ss) format
 * @param {number} seconds - The number of seconds to convert
 * @returns {string} - The formatted time string
 */
function convertSecondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sseconds = Math.floor(seconds % 60);
    minutes = String(minutes).padStart(2, '0');
    sseconds = String(sseconds).padStart(2, '0');
    return `${minutes}:${sseconds}`;
}
```

## Global Variables

Global variables used across multiple functions.

```javascript
let currentSong = new Audio();
let folderName;
```

## Fetch Functions

Functions to fetch folders and songs from the server.

```javascript
/**
 * Fetch all songs in a given folder
 * @param {string} folder - The folder name
 * @returns {Promise<string[]>} - A promise that resolves to an array of song URLs
 */
async function getSong(folder) {
    let response = await fetch(`/allsongs/${folder}/`);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

/**
 * Fetch all folders containing songs
 * @returns {Promise<string[]>} - A promise that resolves to an array of folder URLs
 */
async function getFolders() {
    let response = await fetch(`/allsongs/`);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let as = div.getElementsByTagName("a");
    let folders = [];

    for (let i = 1; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith("/")) {
            folders.push(element.href);
        }
    }
    return folders;
}
```

## Player Functions

Functions related to the audio player, such as playing a track.

```javascript
/**
 * Play a given track
 * @param {string} track - The track URL
 */
const playTrack = (track) => {
    currentSong.src = "/allsongs/" + track;
    currentSong.play();
    play.src = "/images/pause.svg";
    let songName = track.split("(")[0].replaceAll("%20", " ");
    document.querySelector(".song-name").innerHTML = songName;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
}
```

## Main Function

The main function to initialize the application, fetch folders, and set up event listeners.

```javascript
/**
 * Main function to initialize the application
 */
async function main() {
    let folders = await getFolders();
    let folderCard = document.querySelector(".card-container");

    for (let folder of folders) {
        folderName = folder.split("/allsongs/")[1].replace("/", "");
        folderCard.innerHTML += `
        <div class="card">
            <img src="https://visualpharm.com/assets/768/Circled Play-595b40b65ba036ed117d3dd6.svg" alt="play-icon" class="play-icon">
            <img src="/FolderImages/${folderName}.jpg" alt="card" class="poster">
            <h2>${folderName}</h2>
        </div>`;
    }

    let songs;
    let songs_save;
    Array.from(document.querySelector(".card-container").getElementsByTagName("h2")).forEach(e => {
        e.addEventListener("click", async () => {
            folderName = e.innerHTML.trim();
            songs = await getSong(e.innerHTML.trim());
            songs_save = songs;
            let songs_list = document.querySelector("#songs-list");
            songs_list.innerHTML = "";
            for (let song of songs) {
                let songAddress = song.split("/allsongs/")[1];
                let songName = song.split(`/${e.innerHTML.trim()}/`)[1].split("(")[0].replaceAll("%20", " ");
                songs_list.innerHTML += `
                <div class="song-to-play">          
                    <img src="/images/music_icon.svg" alt="icon" class="music-icon">
                    <h2>${songName}</h2>
                    <p>${songAddress}</p>
                    <img src="/images/play-icon.svg" alt="" class="play-icon">
                </div>`;
            }
            Array.from(document.querySelector(".outer").getElementsByClassName("song-to-play")).forEach(e => {
                e.addEventListener("click", () => {
                    playTrack(e.querySelector("p").innerHTML.trim());
                });
            });
        });
    });

    // Event Listeners

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "/images/play-song.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        let time = convertSecondsToMinutes(currentSong.currentTime);
        let duration = convertSecondsToMinutes(currentSong.duration);
        document.querySelector(".song-time").innerHTML = `${time} / ${duration}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentMoved = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentMoved + "%";
        currentSong.currentTime = (currentSong.duration * percentMoved) / 100;
    });

    document.querySelector(".right .hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").style.width = "85vw";
        document.querySelector(".cross").style.visibility = "visible";
    });

    document.querySelector(".upper-box .cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    });

    previous.addEventListener("click", () => {
        let index = songs_save.indexOf(currentSong.src);
        if ((index - 1) >= 0) {
            let songName = songs_save[index - 1].split("/allsongs/")[1];
            playTrack(songName);
        }
    });

    next.addEventListener("click", () => {
        let index = songs_save.indexOf(currentSong.src);
        if (index + 1 < songs_save.length) {
            let songName = songs_save[index + 1].split("/allsongs/")[1];
            playTrack(songName);
        }
    });

    vol_range.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });
}

// Initialize the Application
main();
```

## Event Listeners

Contains all the event listeners for user interactions like play/pause, seek, next, previous, volume change, and menu toggle.

```javascript
// Event Listeners

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        play.src = "/images/pause.svg";
    } else {
        currentSong.pause();
        play.src = "/images/play-song.svg";
    }
});

currentSong.addEventListener("timeupdate", () => {
    let time = convertSecondsToMinutes(currentSong.currentTime);
    let duration = convertSecondsToMinutes(currentSong.duration);
    document.querySelector(".song-time").innerHTML = `${time} / ${duration}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
    let percentMoved = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percentMoved + "%";
    currentSong.currentTime = (currentSong.duration * percentMoved) / 100;
});

document.querySelector(".right .hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.width = "85vw";
    document.querySelector(".cross").style.visibility = "visible";
});

document.querySelector(".upper-box .cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%";
});

previous.addEventListener("click", () => {
   
