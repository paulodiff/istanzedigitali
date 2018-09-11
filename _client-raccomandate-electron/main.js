const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win;

require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600, 
    height: 600,
    backgroundColor: '#ffffff',
    // icon: `file://${__dirname}/dist/assets/logo.png`
  })


  win.webContents.openDevTools()

  // load the dist folder from Angular
   win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/client-raccomandate-electron/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  //// uncomment below to open the DevTools.
  

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})