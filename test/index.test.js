//Nodeunit tests

var fixtures = require('../src/index.js'),
	id = fixtures.createObjectId,
	mongo = require('mongodb'),
	async = require('async'),
	_ = require('underscore');

var dbName = 'pow-mongodb-fixtures-test',
	loader = fixtures.connect(dbName),
	server = new mongo.Db(dbName, new mongo.Server('127.0.0.1', 27017, {})),
	db;
	
	
function loadCollection(name, cb) {
	db.collection(name, function(err, collection) {
		if (err) return cb(err);
		
		collection.find(function(err, cursor) {
			if (err) return cb(err);
			
			cursor.toArray(function(err, docs) {
				if (err) return cb(err);
				
				cb(null, docs);
			});
		});
	});
}

exports['init'] = function(test) {
	server.open(function(err, openDb) {
		if (err) return test.done(err);
		
		db = openDb;
		
		db.dropDatabase(test.done);
	});
};
	
	
exports['createObjectId'] = {
	'with ID': function(test) {
		var objId = id('4eca80fae4af59f55d000020');
		
		test.same(typeof objId, 'object');
		test.same(objId.constructor.name, 'ObjectID');
		test.same(objId.toString(), '4eca80fae4af59f55d000020');
		
		test.done();
	},
	
	'without ID': function(test) {
		var objId = id();
		
		test.same(typeof objId, 'object');
		test.same(objId.constructor.name, 'ObjectID');
		test.same(objId.toString().length, 24);
		
		test.done();
	}
};

exports['load'] = {
	setUp: function(done) {
		db.dropDatabase(done);
	},
	
	'array': function(test) {
		test.expect(2);
		
		var data = {
			southPark: [
				{ name: 'Eric' },
				{ name: 'Butters' },
				{ name: 'Kenny' }
			],
			boredToDeath: [
				{ name: 'Jonathan' },
				{ name: 'Ray' },
				{ name: 'George' }
			]
		};
		
		loader.load(data, function(err) {
			if (err) return test.done(err);
			
			async.parallel([
				function(next) {
					loadCollection('southPark', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Eric', 'Butters', 'Kenny'].sort());
						
						next();
					});
				},
				function(next) {
					loadCollection('boredToDeath', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Jonathan', 'Ray', 'George'].sort());

						next();
					});
				}
			], test.done);
		});
	},
	
	'object': function(test) {
		test.expect(2);
		
		var data = {
			southPark: {
				eric: { name: 'Eric' },
				butters: { name: 'Butters' },
				kenny: { name: 'Kenny' }
			},
			boredToDeath: {
				jonathan: { name: 'Jonathan' },
				ray: { name: 'Ray' },
				george: { name: 'George' }
			}
		};
		
		loader.load(data, function(err) {
			if (err) return test.done(err);

			async.parallel([
				function(next) {
					loadCollection('southPark', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Eric', 'Butters', 'Kenny'].sort());
						
						next();
					});
				},
				function(next) {
					loadCollection('boredToDeath', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Jonathan', 'Ray', 'George'].sort());

						next();
					});
				}
			], test.done);
		});
	},
	
	'file': function(test) {
		loader.load('./fixtures/archer.js', function(err) {
			if (err) return test.done(err);
			
			loadCollection('archer', function(err, docs) {
				if (err) return next(err);
				
				var names = _.pluck(docs, 'name');
				
				test.same(names.sort(), ['Sterling', 'Lana', 'Cheryl'].sort());
				
				test.done();
			});
		});
	},
	
	'directory': function(test) {
		loader.load('./fixtures', function(err) {
			if (err) return test.done(err);
			
			async.parallel([
				function(next) {
					loadCollection('archer', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Sterling', 'Lana', 'Cheryl'].sort());
						
						next();
					});
				},
				function(next) {
					loadCollection('southPark', function(err, docs) {
						if (err) return next(err);
						
						var names = _.pluck(docs, 'name');
						
						test.same(names.sort(), ['Eric', 'Butters', 'Kenny'].sort());

						next();
					});
				}
			], test.done);
		});
	}
};


exports['clearAndLoad'] = {
	setUp: function(done) {
		db.collection('foo', function(err, collection) {
			if (err) return done(err);
			
			collection.insert({ name: 'bar' }, { safe: true }, done);
		});
	},
	
	'clears existing data before inserting': function(test) {
		var data = {
			foo: [{ name: 'baz'}]
		};
		
		loader.clearAndLoad(data, function(err) {
			if (err) return test.done(err);
			
			loadCollection('foo', function(err, docs) {
				if (err) return test.done(err);
				
				test.same(1, docs.length);
				test.same('baz', docs[0].name);
				
				test.done();
			});
		});
	}
};


//Close DB connection and end process when done
exports['exit'] = function(test) {
	db.close();
	
	test.done();
	
	process.nextTick(process.exit);
}