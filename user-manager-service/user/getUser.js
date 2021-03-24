const AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const id = event.pathParameters.id;
    var table = process.env.DYNAMODB_TABLE;

    var params = {
        TableName: table,
        Key: {
            "id": id,
        }
    };

    console.log("Getting items");
    docClient.get(params, (error, data) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update user item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(data, null, 2),
        };
        callback(null, response);
    });


};