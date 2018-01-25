<template>
<div id="wrapper">
  <img id="logo" src="~@/assets/logo.png" alt="electroneum-logo">
  <main>
    <div class="left-side">
      <span class="title">
          ElectroVault Wallet Setup
        </span>
      <system-information></system-information>
    </div>

    <div class="right-side">
      <div class="doc">
        <div class="title">Setup</div>
        <input v-model="walletInfo.filename" placeholder="Filename">
        <input v-model="walletInfo.password" placeholder="Password">
        <p>{{ walletInfo.filename }}:{{ walletInfo.password }}</p>
        <div v-if="setupDone === true">
          <router-link class="button primary" to="/wallet" style="font-weight: 600;">Launch Wallet</router-link><br><br>
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

var request = require('request');
var store = require('store');
const remote = require('electron').remote

export default {
  name: 'walletsetup',
  components: {
    SystemInformation
  },
  data() {
    return {
      setupDone: false,
      w: remote.getCurrentWindow(),
      walletInfo: {
        filename: '',
        password: ''
      }
    }
  },
  methods: {
    notif(text) {
      alert(text)
    },

    // Closes Electron Application
    close() {
      this.w.close();
    },

    walletComplete() {
      var self = this;
      store.set('setupComplete', true);
      self.setupDone = true;
    },

    open(link) {
      this.$electron.shell.openExternal(link);
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
        port: '26969',
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

    openWalletRPC() {
      var electroDir = require('os').homedir() + '\\Desktop\\electrovault_wallet';
      var executablePath = electroDir + '\\electroneum-wallet-rpc.exe';
      console.log(ipcRenderer.sendSync('synchronous-message', {
        message: "start_wallet",
        path: executablePath
      }))
    }

    createWallet(filename, password) {
      var self = this;
      var body = {
        "jsonrpc": "2.0",
        "id": "0",
        "method": "create_wallet",
        "params": {
          "filename": filename,
          "password": password,
          "language": "English"
        }
      };
      var res = self.jsonRpcRequest(body).then(function(result) {
        console.log(result);
        self.walletComplete();
      });

    },

    openWallet(filename, password) {
      var self = this;
      var body = {
        "jsonrpc": "2.0",
        "id": "0",
        "method": "open_wallet",
        "params": {
          "filename": filename,
          "password": password
        }
      };
      var res = self.jsonRpcRequest(body).then(function(result) {
        console.log(result);
        self.walletComplete();
      });
    }
  },
  mounted: function() {
    var self = this;
    self.openWalletRPC();
    console.log("Ready!")

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
  height: auto;
  margin-bottom: 20px;
  width: 100px;
}

main {
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

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
