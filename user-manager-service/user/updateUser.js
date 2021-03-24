const AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const id = event.pathParameters.id;
    const { firstName } = JSON.parse(event.body);
    const { lastName } = JSON.parse(event.body);
    const { site } = JSON.parse(event.body);
    const updatedTime = new Date();
    var table = process.env.DYNAMODB_TABLE;

    var params = {
        TableName: table,
        Key: {
            "id": id,
        },
        UpdateExpression: "set firstName = :f, lastName = :l, updateTime = :u, site = :s",

        ExpressionAttributeValues: {

            ":f": firstName,
            ":l": lastName,
            ":u": updatedTime.toISOString(),
            ":s": site
        },
        ReturnValues: "UPDATED_NEW",

    };

    console.log("updating item");
    docClient.update(params, (error) => {
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
            body: JSON.stringify(params.ReturnValues),
        };
        callback(null, response);
    });


};