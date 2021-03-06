// var login = "jEknowledge4@jEknowledge.com";
// var password = "jEknowledge*4";
//
// function createSession(login, password) {
//   var req = {
//     uri: 'http://api.cloogy.com/api/1.4/sessions',
//     json: true,
//     method: 'POST',
//     body: {
//       "Login": login,
//       "Password": password
//     }
//   };
//
//   var res = rp(req)
//     .then(function (res) {
//       console.log(res.Token);
//     })
//     .catch(function (err) {
//       console.log(err.response.body);
//     });
// }

var rp = require('request-promise');

var token = "dpQxLlhQo8brcNuEN/hN6nkFDvP3Y3E29PVcToniaZY+un5QZ60FWTum3Vd1tlggCLfONrj07OSLVVk9b09zfEs8EOsJQA=="; // 6873

function findUnits(cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/units',
    json: true,
    headers: { 'Authorization': 'ISA ' + token },
  };

  var res = rp(req)
    .then(function (res) {
      cb(res);
    })
    .catch(function (err) {
      console.log(err.response);
    });
}

function findTags(cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/tags',
    json: true,
    headers: { 'Authorization': 'ISA ' + token },
  };

  var res = rp(req)
    .then(function (res) {
      cb(res);
    })
    .catch(function (err) {
      console.log(err.response.body);
    });
}

function findDevices(cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/devices?order=%5B-Id%5D&page_size=200',
    json: true,
    headers: { 'Authorization': 'ISA ' + token },
  };

  var res = rp(req)
    .then(function (res) {
      cb(res);
    })
    .catch(function (err) {
      console.log(err.response.body);
    });
}

function actuate(command, cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/actuations',
    json: true,
    method: 'POST',
    headers: { 'Authorization': 'ISA ' + token },
    body: {
      "TagIds": [148058],
      "Command": command
    }
  };

  var res = rp(req)
    .then(function (res) {
      cb(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}


function consumptionsAllMonth(cb) {
  var ts = Date.now();
  consumptionsAll(cb, ts - 2629746000, ts);
}
function consumptionsAllWeek(cb) {
  var ts = Date.now();
  consumptionsAll(cb, ts - 604800000, ts);
}

function consumptionsAll(cb, from, to) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/consumptions/hourly?from='+from+'&tags=%5B148057%5D&to='+to,
    json: true,
    headers: { 'Authorization': 'ISA ' + token },
  };

  var res = rp(req)
    .then(function (res) {
      cb(res);
    })
    .catch(function (err) {
      console.log(err.response.body);
    });
}

function consumptions(cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/consumptions/yearly?from=1464730000000&tags=%5B148057%5D&to=1467331199000',
    json: true,
    headers: { 'Authorization': 'ISA ' + token },
  };

  var res = rp(req)
    .then(function (res) {
      const data = res.reduce(function (a, b) {
          return {
            Read: a.Read + b.Read,
            ReadCarbon: a.ReadCarbon + b.ReadCarbon,
            Trees: a.Trees + b.Trees,
            Cars: a.Cars + b.Cars
          };
      })
      cb(data);
      //cb(res);
    })
    .catch(function (err) {
      console.log(err.response.body);
    });
}

module.exports = {
  // createSession: createSession,
  findUnits: findUnits,
  findTags: findTags,
  findDevices: findDevices,
  actuate: actuate,
  consumptions: consumptions,
  consumptionsAllMonth: consumptionsAllMonth,
  consumptionsAllWeek: consumptionsAllWeek
};
