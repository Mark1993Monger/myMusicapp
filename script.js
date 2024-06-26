document.addEventListener("DOMContentLoaded", function() {
    const songList = document.querySelectorAll('.song-list li');
    const playButton = document.getElementById('play');
    const pauseButton = document.getElementById('pause');
    const repeatButton = document.getElementById('repeat');
    const volumeBar = document.getElementById('volume-bar');
    const volumeDownButton = document.getElementById('volume-down');
    const volumeUpButton = document.getElementById('volume-up');
    const volumeMessage = document.getElementById('volume-message');
    const volumePercentage = document.getElementById('volume-percentage');
    const songTitle = document.getElementById('song-title');
    const songImage = document.getElementById('song-image');

    let audio = new Audio();
    let currentSong = null;
    let isPlaying = false;
    let repeatMode = 'none'; // Possible values: 'none', 'all', 'one'

    songList.forEach(song => {
        song.addEventListener('click', function() {
            const src = this.getAttribute('data-src');
            const title = this.getAttribute('data-title');
            const image = this.getAttribute('data-image');

            songTitle.textContent = title;
            songImage.src = image;
            audio.src = src;
            audio.play();
            isPlaying = true;
            currentSong = this;
        });
    });

    playButton.addEventListener('click', function() {
        if (currentSong && !isPlaying) {
            audio.play();
            isPlaying = true;
        }
    });

    pauseButton.addEventListener('click', function() {
        if (currentSong && isPlaying) {
            audio.pause();
            isPlaying = false;
        }
    });

    repeatButton.addEventListener('click', function() {
        if (currentSong) {
            if (repeatMode === 'none') {
                repeatMode = 'all';
                audio.loop = true;
                repeatButton.textContent = 'Repeat On';
            } else if (repeatMode === 'all') {
                repeatMode = 'one';
                audio.loop = true;
                repeatButton.textContent = 'Repeat 1';
            } else {
                repeatMode = 'none';
                audio.loop = false;
                repeatButton.textContent = 'Repeat Off';
            }
        }
    });

    volumeDownButton.addEventListener('click', function() {
        if (audio.volume > 0.1) {
            audio.volume -= 0.1;
        } else {
            audio.volume = 0;
        }
        volumeBar.value = audio.volume;
        updateVolumeMessage();
    });

    volumeUpButton.addEventListener('click', function() {
        if (audio.volume < 0.9) {
            audio.volume += 0.1;
        } else {
            audio.volume = 1;
        }
        volumeBar.value = audio.volume;
        updateVolumeMessage();
    });

    volumeBar.addEventListener('input', function() {
        audio.volume = parseFloat(this.value);
        updateVolumeMessage();
    });

    function updateVolumeMessage() {
        const volumePercent = Math.round(audio.volume * 100);
        volumePercentage.textContent = `${volumePercent}%`;
    }

    audio.addEventListener('ended', function() {
        isPlaying = false;
        if (repeatMode === 'one') {
            audio.currentTime = 0;
            audio.play();
        } else if (repeatMode === 'all') {
            const nextSong = currentSong.nextElementSibling || songList[0];
            nextSong.click();
        }
    });
});
