'use strict';

module.exports = function (Check) {

	Check.findAll = function (value, cb) {
		Check.find({
			where: {
				status: {
					neq: value
				}
			}
		}, function (err, response) {
			if (err) throw err;
			cb(null, response);
		});
	};

	Check.remoteMethod('findAll', {
		accepts: {
			arg: 'status',
			type: 'string',
			required: false
		},
		returns: {
			arg: 'response',
			type: 'array',
			root: true
		},
		http: {
			path: '/findAll',
			verb: 'get'
		}
	});



	Check.getSumCheck = function (fromTime, toTime, cb) {

		// let filter = {
		//   where: {
		//     issuedDate: { gt: fromTime },
		//     issuedDate: { lt: toTime }
		//   }
		// };



		let filter = {
			where: {
				cashingDateDesired: { between: [fromTime, toTime] },
				status: "WAITING",
			}
		};


		Check.find(filter, function (err, trafficResults) {

			if (err) return cb(err); // error out and return err msg to client

			let graphData = [];

			// loop on trafficResults to do Summation here
			// collect results inside graphData

			// return clean graphData to client
			for (var i = 0; i < trafficResults.length; i++) {
				graphData.push(trafficResults[i].amount);
			}

			var count = 0;

			for (var i = 0, n = graphData.length; i < n; i++) {
				count += graphData[i];
			}

			cb(null, count);

		});

	}

	Check.remoteMethod('getSumCheck', {
		http: {
			path: '/getSumCheck',
			verb: 'get'
		},
		accepts: [
			{ arg: 'fromTime', type: 'date' },
			{ arg: 'toTime', type: 'date' }
		],
		returns: {
			root: true,
			type: 'array'
		}

	});

	


	Check.getCountCheck = function (fromTime, toTime, cb) {

		let filter = {
			where: {
				cashingDateDesired: { between: [fromTime, toTime] },
				status: "WAITING",

			}
		};


		Check.find(filter, function (err, trafficResults) {

			if (err) return cb(err); // error out and return err msg to client

			let count = trafficResults.length

			cb(null, count);

		});


	}

	Check.remoteMethod('getCountCheck', {
		accepts: [
			{ arg: 'fromTime', type: 'date' },
			{ arg: 'toTime', type: 'date' }
		],
		returns: {
			arg: 'count',
			type: 'number'
		},
		http: {
			path: '/getCountCheck',
			verb: 'get'
		}

	});






	Check.updateAllCheck = function (updates, cb) {


		//var updates = [ "5d6d2b9f66fc7efdb6435624",  "5d6d2d1566fc7efdb6435627", "5d6e7e4be9192c3ba2da13fd"];
		let total = 0;
		//let remise = "11111111"
		for (var i = 1; i < updates.length; i++) {

			Check.updateAll({ id: updates[i] }, { remise_id: updates[0],remiseId: updates[0], status: "ONGOING" }, function (err, total) {
				if (err) {
					console.error(err);
				}
				total++
				console.log(total); // number of data updated
			})
		}


		cb(null, total);

	};



	Check.remoteMethod('updateAllCheck', {
		accepts: [
			{ arg: 'updates', type: 'array', http: { source: 'body' } },


		],
		returns: { arg: 'total', type: 'number' },
		http: {
			path: '/updateAllCheck',
			verb: 'post'
		}

	});



	Check.updateAllCheckRemise = function (updates, cb) {


		//var updates = [ "5d6d2b9f66fc7efdb6435624",  "5d6d2d1566fc7efdb6435627", "5d6e7e4be9192c3ba2da13fd"];
		let total = 0;
		//let remise = "11111111"
		if (updates[0] == "Valide") {
			for (var i = 1; i < updates.length; i++) {

				Check.updateAll({ id: updates[i] }, {  status: "CASHED" }, function (err, total) {
					if (err) {
						console.error(err);
					}
					total++
					console.log(total); // number of data updated
				})
			}
		} else if (updates[0] == "Rejeter") {
			for (var i = 1; i < updates.length; i++) {

				Check.updateAll({ id: updates[i] }, { status: "REJECTED" }, function (err, total) {
					if (err) {
						console.error(err);
					}
					total++
					console.log(total); // number of data updated
				})
			}
		} else if (updates[0] == "Partiel") {
			for (var i = 1; i < updates.length; i++) {

				Check.updateAll({ id: updates[i] }, { status: "ONGOING" }, function (err, total) {
					if (err) {
						console.error(err);
					}
					total++
					console.log(total); // number of data updated
				})
			}
		}

		cb(null, total);

	};



	Check.remoteMethod('updateAllCheckRemise', {
		accepts: [
			{ arg: 'updates', type: 'array', http: { source: 'body' } },


		],
		returns: { arg: 'total', type: 'number' },
		http: {
			path: '/updateAllCheckRemise',
			verb: 'post'
		}

	});








};
