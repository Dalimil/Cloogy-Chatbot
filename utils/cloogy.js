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

var token = "LKC0LUx0nfsM9hqQe8YQG2GHaEF4tN57CwE6mW83GJ78VJEccarGpGJo/ALGb4Kyl5UYKdK8xhSPCPVO/kW63A9oNDqe8+wy4LpSDZBDV9wg660VjD0tgDH7"; // 6873

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

function actuate(tagId, command, cb) {
  var req = {
    uri: 'http://api.cloogy.com/api/1.4/actuations',
    json: true,
    method: 'POST',
    headers: { 'Authorization': 'ISA ' + token },
    body: {
      "TagId": "a",//tagId,
      "Command": "a"//command
    }
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
    uri: 'http://api.cloogy.com/api/1.4/consumptions/daily?from=1464739200000&tags=%5B148057%5D&to=1467331199000',
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
      // cb(res);
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
  consumptions: consumptions
};
