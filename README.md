pow-mongodb-fixtures
=================

Simple fixture loader for MongoDB on NodeJS.  Makes managing relationships between documents easier.

Fixtures can be in one file, or divided up into separate files for organisation 
(e.g. one file per model)

The fixture files must export objects which are keyed by the MongoDB collection name, each
containing the data for documents within that.

WARNING: Loading fixtures will clear the existing contents of a collection!

FOR EXAMPLE:
With the file below, 3 documents will be inserted into the 'users' collection and 2 into the 'businesses' collection:

    //fixtures.js
    exports.users = [
        { name: 'Gob' },
        { name: 'Buster' },
        { name: 'Steve Holt' }
    ];

    exports.businesses = [
        { name: 'The Banana Stand' },
        { name: 'Bluth Homes' }
    ];


You can also load fixtures as an object where each document is keyed, in case you want to reference another document. This example uses the included `createObjectId` helper:

    //users.js
    var id = require('pow-mongodb-fixtures').createObjectId;

    exports.users = {
        user1: {
            _id: id(),
            name: 'Michael'
        },
        user2: {
            _id: id(),
            name: 'George Michael',
            father: exports.User.user1._id
        },
        user3: {
            _id: id('4ed2b809d7446b9a0e000014'),
            name: 'Tobias'
        }
    }


Usage
-----

    var fixtures = require('pow-mongodb-fixtures').connect('dbname');
    
    //Objects
    fixtures.load({
        users: [
            { name: 'Maeby' },
            { name: 'George Michael' }
        ]
    });

    //Files
    fixtures.load(__dirname + '/fixtures/users.js');

    //Directories (loads all files in the directory)
    fixtures.load(__dirname + '/fixtures');


clearAndLoad()
--------------

The same as load(), but drops the database before inserting the new documents.


Installation
------------

	npm install pow-mongodb-fixtures