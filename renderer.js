const { ipcRenderer } = require("electron");


ipcRenderer.on('fileInfo', (event, filePath) => {
    const videoPlayer = document.querySelector('.js-player');
    const vidSource = document.getElementById('vidSource');

    vidSource.src = filePath;

    videoPlayer.load();

})

