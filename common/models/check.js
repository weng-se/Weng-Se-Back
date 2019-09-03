'use strict';

module.exports = function(Check) {

	Check.findAll = function(value, cb) {
	    Check.find({ 
	        where: { 
	            status: {
	            	neq: value
	            }
	        }
	    }, function(err, response) {
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
		       issuedDate: { between : [fromTime, toTime ]},
		    }
		};


	    Check.find(filter, function(err, trafficResults) {

	      if(err) return cb(err); // error out and return err msg to client

	      let graphData = [];

	      // loop on trafficResults to do Summation here
	      // collect results inside graphData

	      // return clean graphData to client
	      for (var i = 0; i < trafficResults.length; i++) {
			graphData.push(trafficResults[i].amount);
		  }
		  
		  var count = 0;
		  
		  for(var i=0, n=graphData.length; i < n; i++) { 
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
		       issuedDate: { between : [fromTime, toTime ]},
		       
		     }
		   };
		
   
		   Check.find(filter, function(err, trafficResults) {
   
		     if(err) return cb(err); // error out and return err msg to client
		
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

		
		//var updates = [{id : "5d6d2b9f66fc7efdb6435624", remise_id: "5d4ed6062823840f5880e1c5"}, {id : "5d6d2d1566fc7efdb6435627", remise_id: "5d4ed6062823840f5880e1c5"}];
		let total = 0;

		updates.forEach(function(element) {
			
			Check.updateAll({id : element.id}, {remise_id :element.remise_id}, function(err, count) {
				  if (err) {
					console.error(err);
				  }
				  total += 1;
				  console.log(total); // number of data updated
				})
				
			})
		

		
		     cb(null, total);
   
		   };

	
   
		 Check.remoteMethod('updateAllCheck', {
		   	accepts: [
			    { arg: 'updates', type: 'array' },
		   	],
		   	returns: { 
		   		arg: 'total', 
		   		type: 'number' 
		   	},
			http: {
		        path: '/updateAllCheck',
		        verb: 'post'
		    }
		
	   });





};
