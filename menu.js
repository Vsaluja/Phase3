const { Menu, dialog } = require('electron');
const isMac = process.platform === 'darwin';
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static-electron');
const ffprobe_static = require('ffprobe-static-electron');
const ProgressBar = require('electron-progressbar');

ffmpeg.setFfmpegPath(ffmpeg_static.path);
ffmpeg.setFfprobePath(ffprobe_static.path);

let filePath;
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Video",
                submenu: [
                    {
                        label: "Load",
                        click(event, parentWindow) {
                            const dialogOptions = {
                                title: "Select a file",
                                defaultPath: __dirname,
                                filters: [
                                    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] }
                                ]
                            }
                            dialog.showOpenDialog(parentWindow, dialogOptions)
                                .then((fileInfo) => {
                                    if (fileInfo.canceled) {
                                        console.log("User cancelled selection");
                                    }
                                    else {

                                        // console.log("Selected file:", fileInfo.filePaths[0]); // Debug log
                                        // Send fileInfo using IPC
                                        parentWindow.webContents.send('fileInfo', fileInfo.filePaths[0]);

                                        // Enable the "Convert to AVI" menu item
                                        convertToAVIMenuItem.enabled = true;
                                        convertToMP4MenuItem.enabled = true;
                                        convertToWEBMMenuItem.enabled = true;

                                        filePath = fileInfo.filePaths[0];

                                        console.log("Selected file:", fileInfo.filePaths[0]); // Debug log
                                        // Send fileInfo using IPC
                                        parentWindow.webContents.send('fileInfo', fileInfo.filePaths[0]);


                                    }
                                })
                                .catch((e) => {
                                    console.log(e);
                                })
                        }
                    },
                    {
                        type: 'separator'

                    },
                    {
                        label: "Convert to AVI",
                        enabled: false,
                        id: 'convertToAVI',
                        click(event, parentWindow) {
                            dialog.showSaveDialog(parentWindow)
                                .then((saveLocation) => {

                                    let percentage = 0;

                                    ffmpeg(filePath).toFormat('avi')
                                        .on('end', () => { console.log("File conversion finished") })
                                        .on('progress', (timemark) => {

                                            percentage = Math.round(timemark.percent);

                                        })
                                        .saveToFile(saveLocation.filePath + '.avi');


                                    let progressBar = new ProgressBar({
                                        indeterminate: false,
                                        text: 'Video conversion In progress...',
                                        detail: 'Please wait...'
                                    });

                                    progressBar
                                        .on('completed', function () {
                                            console.info(`completed...`);
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('aborted', function (value) {
                                            console.info(`aborted... ${value}`);
                                        })
                                        .on('progress', function (value) {
                                            progressBar.detail = `${value}% complete`;
                                        });

                                    setInterval(function () {
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = percentage;
                                        }
                                    }, 50);

                                })
                                .catch((error) => {
                                    console.log(error);
                                })

                        }
                    },
                    {
                        label: "Convert to MP4",
                        enabled: false,
                        id: 'convertToMP4',
                        click(event, parentWindow) {
                            dialog.showSaveDialog(parentWindow)
                                .then((saveLocation) => {

                                    let percentage = 0;

                                    ffmpeg(filePath).toFormat('mp4')
                                        .on('end', () => { console.log("File conversion finished") })
                                        .on('progress', (timemark) => {
                                            percentage = Math.round(timemark.percent);
                                        })
                                        .saveToFile(saveLocation.filePath + '.mp4');


                                    let progressBar = new ProgressBar({
                                        indeterminate: false,
                                        text: 'Video conversion In progress...',
                                        detail: 'Please wait...'
                                    });

                                    progressBar
                                        .on('completed', function () {
                                            console.info(`completed...`);
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('aborted', function (value) {
                                            console.info(`aborted... ${value}`);
                                        })
                                        .on('progress', function (value) {
                                            progressBar.detail = `${value}% complete`;
                                        });

                                    setInterval(function () {
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = percentage;
                                        }
                                    }, 50);
                                })
                                .catch((error) => {
                                    console.log(error);
                                })

                        }
                    },
                    {
                        label: "Convert to WEBM",
                        enabled: false,
                        id: 'convertToWEBM',
                        click(event, parentWindow) {
                            dialog.showSaveDialog(parentWindow)
                                .then((saveLocation) => {

                                    let percentage = 0;

                                    ffmpeg(filePath).toFormat('webm')
                                        .on('end', () => { console.log("File conversion finished") })
                                        .on('progress', (timemark) => {

                                            percentage = Math.round(timemark.percent);

                                        })
                                        .saveToFile(saveLocation.filePath + '.webm');

                                    let progressBar = new ProgressBar({
                                        indeterminate: false,
                                        text: 'Video conversion In progress...',
                                        detail: 'Please wait...'
                                    });

                                    progressBar
                                        .on('completed', function () {
                                            console.info(`completed...`);
                                            progressBar.detail = 'Task completed. Exiting...';
                                        })
                                        .on('aborted', function (value) {
                                            console.info(`aborted... ${value}`);
                                        })
                                        .on('progress', function (value) {
                                            progressBar.detail = `${value}% complete`;
                                        });

                                    setInterval(function () {
                                        if (!progressBar.isCompleted()) {
                                            progressBar.value = percentage;
                                        }
                                    }, 50);



                                })
                                .catch((error) => {
                                    console.log(error);
                                })

                        }

                    }
                ]
            },
            { type: 'separator' },
            {
                label: "Quit",
                role: isMac ? "close" : "quit"
            }
        ]
    },
    {
        label: "Developer",
        submenu: [
            {
                label: "Toggle Developer Tools",
                role: 'toggleDevTools'
            }
        ]
    }
];

// Move menu over if on MAC, so we get a File menu
if (isMac) {
    menuTemplate.unshift(
        {
            label: 'placeholder'
        }
    );
}

const menu = Menu.buildFromTemplate(menuTemplate);

// Get reference to the "Convert to AVI" menu item
const convertToAVIMenuItem = menu.getMenuItemById('convertToAVI');
const convertToMP4MenuItem = menu.getMenuItemById('convertToMP4');
const convertToWEBMMenuItem = menu.getMenuItemById('convertToWEBM');

module.exports = menu;
