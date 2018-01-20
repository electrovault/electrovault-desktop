<template>
<div id="wrapper">
  <img id="logo" src="~@/assets/logo.png" alt="electroneum-logo">
  <main>
    <div class="left-side">
      <span class="title">
          ElectroVault Installation
        </span>
      <system-information></system-information>
    </div>

    <div class="right-side">
      <div class="doc">
        <div class="title">Installing...</div>
        <ul class="install-list">
          <vue-progress-bar></vue-progress-bar>
          <li v-for="step in installSteps">
            <div class="progress" v-bind:class="{ pending: step.pending, error: step.error, success: step.success }"></div> {{ step.title }}
          </li>
        </ul>
        <div v-if="installDone === true">
          <router-link class="button primary" to="/wallet" style="font-weight: 600;">Launch ElectroVault</router-link><br><br>
        </div>
        <div v-else>
          <button @click="close" class="button button-info">Cancel setup</button><br><br>
        </div>
      </div>
    </div>
  </main>
</div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'

var fs = require('fs');
var path = require('path');
var cmd = require('node-cmd');
var store = require('store');
var request = require('request');
var unzip = require('unzip');
var progress = require('request-progress');
var extract = require('extract-zip')
var http = require('http');

const remote = require('electron').remote
const {
  ipcRenderer
} = require('electron');

export default {
  name: 'install',
  components: {
    SystemInformation
  },
  data() {
    return {
      installSteps: [{
          'title': 'Setting up filesystem',
          'pending': false,
          'error': false,
          'success': false
        },
        {
          'title': 'Downloading Dependencies',
          'pending': false,
          'error': false,
          'success': false
        },
        {
          'title': 'Installing Dependencies',
          'pending': false,
          'error': false,
          'success': false
        },
        {
          'title': 'Downloading Blockchain (This could take a while)',
          'pending': false,
          'error': false,
          'success': false
        },
        {
          'title': 'Cleaning Up',
          'pending': false,
          'error': false,
          'success': false
        }
      ],
      downloadsLinux: [{
        'component': 'linux-x64',
        'url': 'https://github.com/electroneum/electroneum/releases/download/v0.11.0.0/linux-x64-0.11.0.0.zip',
        'finished': false
      }, ],
      downloadsWindows: [{
          'component': 'win-x64',
          'url': 'https://github.com/electroneum/electroneum/releases/download/v0.11.0.0/win-x64-0.11.0.0.zip',
          'finished': false
        },
        {
          'component': 'win-x86',
          'url': 'https://github.com/electroneum/electroneum/releases/download/v0.11.0.0/win-x86-0.11.0.0.zip',
          'finished': false
        }
      ],
      downloadsMac: [{
        'component': 'macOS-x64',
        'url': 'https://github.com/electroneum/electroneum/releases/download/v0.11.0.0/macOS-x64-0.11.0.0.zip',
        'finished': false
      }],
      directories: [

      ],
      complete: -1,
      installDone: false,
      w: remote.getCurrentWindow(),
      downloadBar: 0,
      arch: null,
      height: 0
    }
  },
  methods: {

    // Open a link externally (Default, not really needed)
    open(link) {
      this.$electron.shell.openExternal(link);
    },

    // Closes Electron Application
    close() {
      this.w.close();
    },
    // Check if setup is complete.
    checkComplete() {
      var self = this;

      if (self.installSteps[0].success == true && self.installSteps[1].success == true && self.installSteps[2].success == true && self.installSteps[3].success == true && self.installSteps[4].success == true) {
        store.set('setupComplete', true);
        self.installDone = true;
      }
    },
    niceBytes(x) {
      var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0,
        n = parseInt(x, 10) || 0;
      while (n >= 1024) {
        n = n / 1024;
        l++;
      }
      return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
    },
    // No linux or mac support as of yet.
    download(url, outputFile) {
      var self = this;
      self.installSteps[1].pending = true;
      //self.$Progress.start();

      progress(request(url))
        .on('progress', function(state) {
          var percent = state.percent * 100;
          console.log('progress :: ' + percent);
          self.downloadBar = percent;
          if (percent > 1) {
            this[1].$Progress.set(percent);
            this[1].installSteps[1].title = "Downloading Electroneum (" + this[1].niceBytes(state.speed) + "/s)";
          }
        }.bind({
          1: self
        }))
        .on('error', function(err) {
          self.makeError(1);
        })
        .on('end', function() {
          self.makeSuccess(1);
          store.set('coreDownloaded', true);
          self.$Progress.set(100)
          self.$Progress.finish()
          self.installSteps[1].title = "Download Completed"
          self.makePending(2);
          self.makeUnzip(self.directories['coreDir'], self.directories['electroDir'])
        })
        .pipe(fs.createWriteStream(outputFile));

    },
    getFilesizeInBytes(filename) {
      const stats = fs.statSync(filename)
      const fileSizeInBytes = stats.size
      return fileSizeInBytes
    },

    makeError(num) {
      var self = this;
      self.installSteps[num].pending = false;
      self.installSteps[num].error = true;
      self.installSteps[num].success = false;
    },

    makePending(num) {
      var self = this;
      self.installSteps[num].pending = true;
      self.installSteps[num].error = false;
      self.installSteps[num].success = false;
    },

    makeSuccess(num) {
      var self = this;
      self.installSteps[num].pending = false;
      self.installSteps[num].error = false;
      self.installSteps[num].success = true;
    },
    jsonRpcRequest(body) {
      let requestJSON = JSON.stringify(body);

      // set basic headers
      let headers = {};
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(requestJSON, 'utf8');

      // make a request to the wallet
      let options = {
        hostname: '127.0.0.1',
        port: '26968',
        path: '/json_rpc',
        method: 'POST',
        headers: headers
      };
      let requestPromise = new Promise((resolve, reject) => {
        let data = '';
        let req = http.request(options, (res) => {
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', function() {
            let body = JSON.parse(data);
            if (body && body.result) {
              resolve(body.result);
            } else if (body && body.error) {
              resolve(body.error);
            } else {
              resolve('Wallet response error. Please try again.');
            }
          });
        });
        req.on('error', (e) => resolve(e));
        req.write(requestJSON);
        req.end();
      });

      return requestPromise;
    },
    getHeight() {
      var self = this;
      var body = {
        id: "0",
        jsonrpc: "2.0",
        method: "get_info"
      };
      var res = self.jsonRpcRequest(body).then(function(result) {
        self.localInfo = result
        request('https://supply.electroneum.com', function(a, b, c) {
          self.targetHeight = JSON.parse(c).height;
          self.height = self.localInfo.height;
          self.installSteps[3].title = "Downloading Blockchain (" + self.localInfo.height + "/" + self.targetHeight + ")"
          if (self.localInfo.height >= self.targetHeight) {
            store.set('setupComplete', true);
            self.installSteps[3].title = "Blockchain Downloaded"
            self.makeSuccess(0);
            self.makeSuccess(1);
            self.makeSuccess(2);
            self.makeSuccess(3);
            self.makeSuccess(4);
            self.checkComplete();
            //self.$router.push('/wallet');
          }
        });
      });
    },
    makeUnzip(file, target) {
      var self = this;
      extract(file, {
        dir: target
      }, function(err) {
        if (err != undefined) {
          self.makeError(2);
        } else {
          store.set('coreUnzipped', true)
          self.makeSuccess(2);
          self.installSteps[2].title = "Dependencies Installed"
          console.log("Dependencies Installed :: Start The Daemon")
          self.makePending(3);
          self.runDaemon();
        }
      })
    },
    runDaemon() {
      var self = this;
      var executablePath = self.directories['electroDir'] + '\\electroneumd.exe';
      console.log(ipcRenderer.sendSync('synchronous-message', {
        message: "start_daemon",
        path: executablePath
      }))
      ipcRenderer.on('ping', (event, message) => {
        if (message == 'start_height') {
          console.log('Starting height...');
          setInterval(function() {
            self.getHeight();
          }, 5000)
        } else {
          console.log("Not a valid IPC request...");
        }
      })
    },
    startInstall() {
      var self = this;
      self.directories['electroDir'] = require('os').homedir() + '\\Desktop\\electrovault_wallet';
      self.directories['coreDir'] = require('os').homedir() + '\\Desktop\\electrovault_wallet\\core.zip';
      self.directories['walletsDir'] = self.directories['electroDir'] + '\\wallets';
      self.arch = require('os').arch();

      store.set('coreDownloaded', false)
      // Create Electroneum directory
      self.installSteps[0].pending = true;
      if (!fs.existsSync(self.directories['electroDir'])) {
        console.log("Creating main directory...");
        fs.mkdirSync(self.directories['electroDir']);
        if (!fs.existsSync(self.directories['walletsDir'])) {
          console.log("Creating wallets directory...");
          fs.mkdirSync(self.directories['walletsDir']);
          self.makeSuccess(0);
          self.checkComplete();
        } else {
          self.makeSuccess(0);
          self.checkComplete();
        }
        self.makeSuccess(0);
        self.checkComplete();
      } else if (!fs.existsSync(self.directories['walletsDir'])) {
        console.log("Creating wallets directory...");
        fs.mkdirSync(self.directories['walletsDir']);
        self.makeSuccess(0);
        self.checkComplete();
      } else if (fs.existsSync(self.directories['electroDir']) && fs.existsSync(self.directories['walletsDir'])) {
        console.log("Skipping directories...");
        self.makeSuccess(0);
      } else {
        alert('Please remove the current electrovault directory located at: "' + self.directories['electroDir'] + '" and try again.')
        self.makeError(0);
      }
      // End of electroneum directory creation.

      // Beginning of steps 2-4;
      self.installSteps[1].pending = true;
      if (self.installSteps[0].success == true) {
        // Download Electroneum daemon and requisite files
        if (!fs.existsSync(self.directories['coreDir'])) {
          if (self.arch == 'x64') {
            var windl = self.downloadsWindows[0].url;
            console.log("Starting download...");
            self.download(windl, self.directories['coreDir']);
            if (self.getFilesizeInBytes(self.directories['coreDir']) == 111511171) {
              self.makeSuccess(1);
              self.downloadsWindows[0].finished = true;
            }
          } else if (self.arch == 'x86' || self.arch == 'x32') {
            var windl = self.downloadsWindows[1].url;
            console.log("Starting download...");
            self.download(windl, self.directories['coreDir']);
            if (self.getFilesizeInBytes(self.directories['coreDir']) == 111511171) {
              self.makeSuccess(1);
              self.downloadsWindows[0].finished = true;
            }
          } else {
            console.log()
          }
        } else {
          if (self.getFilesizeInBytes(self.directories['coreDir']) == 111511171) {
            console.log("Skipping download...")
            self.makeSuccess(1);
            store.set('coreDownloaded', true);
            self.checkComplete();
          } else {
            // remove the download and start again
            console.log("Removing old file ...")
            fs.unlinkSync(self.directories['coreDir']);
            if (self.arch == 'x64') {
              var windl = self.downloadsWindows[0].url;
              console.log("Starting download...");
              self.download(windl, self.directories['coreDir']);
              if (self.getFilesizeInBytes(self.directories['coreDir']) == 111511171) {
                self.makeSuccess(1);
                self.downloadsWindows[0].finished = true;
              }
            } else if (self.arch == 'x86' || self.arch == 'x32') {
              var windl = self.downloadsWindows[1].url;
              console.log("Starting download...");
              self.download(windl, self.directories['coreDir']);
              if (self.getFilesizeInBytes(self.directories['coreDir']) == 111511171) {
                self.makeSuccess(1);
                self.downloadsWindows[0].finished = true;
              }
            }
          }
        }
      } else {
        self.makeError(1);
      }

      if (store.get('coreDownloaded') == true) {
        self.makePending(2);
        self.makeUnzip(self.directories['coreDir'], self.directories['electroDir'])
      }
    }
  },
  mounted: function() {
    var self = this;
    this.startInstall()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient( ellipse at top left,
  rgba(255, 255, 255, 1) 40%,
  rgba(229, 229, 229, .9) 100%);
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  float: left;
  height: 100px;
  margin-bottom: 40px;
  width: auto;
}

#logo-text {
  float: left;
  margin-left: 20px;
  line-height: 100px;
  font-size: 18pt;
  font-weight: bold;
}

main {
  clear: left;
  display: flex;
  justify-content: space-between;
}

main>div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.install-list {
  color: #555;
  font-weight: initial;
  list-style-type: none;
  margin-bottom: 50px;
}

.intall-list li {
  color: #000;
  height: 20px;
}

.install-list li code {
  color: #3e3e3e;
  font-weight: bold;
}

.progress {
  float: left;
  width: 10px;
  height: 10px;
  margin-top: 6px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: #d1d1d1;
}

.pending {
  border: 2px solid #7ed35f;
  background-color: transparent;
}

.success {
  background-color: #7ed35f;
}

.error {
  background-color: #ef4049;
}

.doc .button {
  font-size: .9em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #2F77F7;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #2F77F7;
  margin-top: 10px;
  text-decoration: none;
  -webkit-app-region: no-drag;
}

.doc .button:hover {
  background-color: #2262d6;
}

.doc .button-alt {
  color: #3e3e3e;
  margin-right: 5px;
  background-color: transparent;
}

.doc .button-alt:hover {
  background-color: #e2e2e2;
}

.doc .button-info {
  border-color: #3e3e3e;
  color: #3e3e3e;
  margin-right: 5px;
  background-color: transparent;
}

.doc .button-info:hover {
  background-color: #e2e2e2;
}
</style>
