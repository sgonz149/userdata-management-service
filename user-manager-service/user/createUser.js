
const uuid = require('uuid');
const AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const id = uuid.v4();
    const { firstName } = JSON.parse(event.body);
    const { lastName } = JSON.parse(event.body);
    const createdTime = new Date();
    const deleteDate = new Date();
    deleteDate.setMonth(deleteDate.getMonth() + 12);
    const updatedTime = new Date();
    const { site } = JSON.parse(event.body);
    var table = process.env.DYNAMODB_TABLE;

    var params = {
        TableName: table,
        Item: {
            "id": id,
            firstName,
            lastName,
            dateCreated: createdTime.toISOString(),
            deleteDate: updatedTime.toISOString(),
            updatedTime: updatedTime.toISOString(),
            site
        }

    }

    console.log("adding new item");
    docClient.put(params, (error) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the user item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });


};
