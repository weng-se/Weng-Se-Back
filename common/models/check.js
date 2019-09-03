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





};
