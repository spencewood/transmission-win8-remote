var assert = require('should');
var _ = require('lodash');
require('../Transmission.App/js/util/lodash-mixins');

describe('Lodash mixins', function(){
	describe('Date to minutes after midnight', function(){
		it('should be 0 at midnight', function(){
			var d = new Date();
			d.setHours(0,0,0,0);
			_.dateToMinutesAfterMidnight(d).should.equal(0);
		});

		it('should be 360 minutes at 6:00 AM', function(){
			var d = new Date();
			d.setHours(6, 0, 0, 0);
			_.dateToMinutesAfterMidnight(d).should.equal(360);
		});
	});

	describe('Minutes after midnight to Date', function(){
		it('should have an hour of 0 with 10 minutes after', function(){
			_.minutesAfterMidnightToDate(10).getHours().should.equal(0);
		});

		it('should have an hour of 7 with 420 minutes after', function(){
			_.minutesAfterMidnightToDate(420).getHours().should.equal(7);
		});
	});
});