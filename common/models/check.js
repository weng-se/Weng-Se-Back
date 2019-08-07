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

};
