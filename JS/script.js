console.log("hey")
let currentSong = new Audio();
let songs;
let currFolder

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    // shows all songs in playlist 
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>   <img class = "invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").split("%28")[0]} </div>
                                 <div></div>
                            </div>
                            <div class="playnow">

                                <img class = "invert" src="Images/play2.svg" alt="">
                            </div>
        
        
        
        
        
        </li>`;
    }

    // Attach eventListener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)


        })

    })
    return songs

}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = mins < 10 ? '0' + mins : mins;
    const formattedSecs = secs < 10 ? '0' + secs : secs;

    return `${formattedMins}:${formattedSecs}`;
}


const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src = "Images/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() { 
    console.log("displaying albums")
    let a = await fetch(`songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess") && !e.href.includes(".DS_Store")) {
            let folder = e.href.split("/").slice(-2)[0]
            // let folder = e.href.split("/").filter(Boolean).pop();
            // Get the metadata of the folder
            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Circle background -->
  <circle cx="50" cy="50" r="48" fill="#32CD32" />
  
  <!-- Play button -->
  <polygon points="40,30 70,50 40,70" fill="black" />
</svg>

            </div>

            <img src="songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            
        </div>`
        }
    }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0].replaceAll("%20", " "))

        })
    })
}
async function main() {
    // get list of all songs
    await getSongs("songs/cs")

    // playMusic(songs[0] , true)

    // Display all songs on page
    displayAlbums()



    // Attach eventListener to play previous next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "Images/play2.svg"
        }
    })

    // time update
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add eventListener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // add eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add eventListener to hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%", "transition: all .3s;";
        // document.querySelector(".left").style.left = ;
    })

    // add eventListener to previous
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " "))
        }
    })
    // add eventListener to next
    next.addEventListener("click", () => {
        // currentSong.pause()


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replaceAll("%20", " "))
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Volume:", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
         if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add eventListener to Mute
    
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target)
        
    

            
            if (e.target.src.includes("Images/volume.svg")) {
                e.target.src = e.target.src.replace("Images/volume.svg", "Images/mute.svg")
                currentSong.volume = 0
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0
            }
            
        
            else {
                e.target.src = e.target.src.replace("Images/mute.svg", "Images/volume.svg")
                currentSong.volume = 0.50;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 50

            }

    })


}

main() 