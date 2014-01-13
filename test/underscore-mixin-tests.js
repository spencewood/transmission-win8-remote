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

	describe('Number to binary array', function(){
		it('should return [1,0,0,0,0,0,0,1] for 65', function(){
			_.numberToBinaryArray(65).join('').should.equal([1,0,0,0,0,0,1].join(''));
		});

		it('should return [1,1,1,1,1,1,1,1] for 127', function(){
			_.numberToBinaryArray(127).join('').should.equal([1,1,1,1,1,1,1].join(''));
		});
	});

	describe('Binary array to number', function(){
		it('should return 65 for [1,0,0,0,0,0,1]', function(){
			_.binaryArrayToNumber([1,0,0,0,0,0,1]).should.equal(65);
		});

		it('should return 127 for [1,1,1,1,1,1,1]', function(){
			_.binaryArrayToNumber([1,1,1,1,1,1,1]).should.equal(127);
		});
	});

	describe('Nested pluck', function(){
		it('should pluck 2 deep', function(){
			var data = [
				{
					name: 'a',
					trackers: [{
						host: 'a'
					}]
				},
				{
					name: 'b',
					trackers: [{
						host: 'b'
					}]
				}
			];

			var pl = _.nestedPluck(data, 'trackers', 'host')
			pl.length.should.equal(2);
			_.last(pl).should.equal('b');
		});

		it('should pluck 3 deep', function() {
			var data = [
				{
					person: [
						{
							name: [
								{
									first: 'bob'
								}
							]
						}
					]
				}
			];

			_.first(_.nestedPluck(data, 'person', 'name', 'first')).should.equal('bob');
		});
	});

	describe('Multi pluck', function(){
		it('should pluck any number of passed in keys', function(){
			var data = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}];

			var p = _.multiPluck(data, 'id', 'name');
			_.last(p).name.should.equal('bar');
			_.size(p).should.equal(2);
		});
	});
});