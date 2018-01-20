import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1200,
    icon: __dirname + '../renderer/assets/logo.png'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    // Kill the child process here

  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC main
ipcMain.on('synchronous-message', (event, arg) => {
  if (arg.message == 'start_daemon') {
    event.returnValue = 'Starting daemon...';
    var executablePath = arg.path;
    var spawn = require('child_process').execFile;
    var daemon = spawn(executablePath);
    daemon.stdout.on('data', function(data) {
      console.log(data);
      if (data.indexOf('Core rpc server started ok') != -1) {
        mainWindow.webContents.send('ping', 'start_height')
      }
    });
  } else if (arg.message == 'stop_daemon') {
    event.returnValue = 'Stopping daemon...';
  }
})
