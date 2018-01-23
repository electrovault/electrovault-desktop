<template>
  <div class="main-panel">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle">
                          <span class="sr-only">Toggle navigation</span>
                          <span class="icon-bar bar1"></span>
                          <span class="icon-bar bar2"></span>
                          <span class="icon-bar bar3"></span>
                      </button>
          <a class="navbar-brand" href="#">Overview</a>
          <input id="address" type="text" class="form-control" disabled="" placeholder="0" value="">
          <a href="#" id="copyaddress" style="font-size: 11px">copy address</a>
        </div>
      </div>
    </nav>


    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-3 col-sm-6">
            <div class="card">
              <div class="content">
                <div class="row">
                  <div class="col-xs-5">
                    <div class="icon-big icon-success text-center">
                      <i class="ti-wallet"></i>
                    </div>
                  </div>
                  <div class="col-xs-7">
                    <div class="numbers">
                      <p>Balance:</p>
                      <span id="balance"></span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <hr />
                  <div class="stats">
                    <i class="ti-reload"></i> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="card">
              <div class="content">
                <div class="row">
                  <div class="col-xs-5">
                    <div class="icon-big icon-warning text-center">
                      <i class="ti-server"></i>
                    </div>
                  </div>
                  <div class="col-xs-7">
                    <div class="numbers">
                      <p>Blockchain:</p>
                      <span id="height"></span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <hr />
                  <div class="stats">
                    <i class="ti-reload"></i> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="card">
              <div class="content">
                <div class="row">
                  <div class="col-xs-5">
                    <div class="icon-big icon-success text-center">
                      <i class="ti-money"></i>
                    </div>
                  </div>
                  <div class="col-xs-7">
                    <div class="numbers">
                      <p>Bal. USD:</p>
                      <span id="usd">00.00</span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <hr />
                  <div class="stats">
                    <i class="ti-reload"></i> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-sm-6">
            <div class="card">
              <div class="content">
                <div class="row">
                  <div class="col-xs-5">
                    <div class="icon-big icon-info text-center">
                      <i class="ti-stats-up"></i>
                    </div>
                  </div>
                  <div class="col-xs-7">
                    <div class="numbers">
                      <p>Rank</p>
                      <span id="rank"></span>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <hr />
                  <div class="stats">
                    <i class="ti-reload"></i> Updated now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">

          <div class="col-md-12">
            <div class="card">
              <div class="header">
                <h4 class="title">Transactions</h4>
                <p class="category">Incoming / Outgoing</p>
              </div>
              <div class="content table-responsive table-full-width">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Pool</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Country</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Dakota Rice</td>
                      <td>$36,738</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Minerva Hooper</td>
                      <td>$23,789</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sage Rodriguez</td>
                      <td>$56,142</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Philip Chaney</td>
                      <td>$38,735</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Doris Greene</td>
                      <td>$63,542</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Mason Porter</td>
                      <td>$78,615</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homewallet',
  components: {

  },
  data() {
    return {}
  },
  methods: {
  },
  mounted: function() {
    var self = this;

  }
}
</script>

<style>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
@import url('../../assets/css/paper-dashboard.css');
@import url('https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css');
@import url('../../assets/css/animate.min.css');
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>
