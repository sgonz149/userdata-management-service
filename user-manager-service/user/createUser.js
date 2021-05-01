
const uuid = require('uuid');
const AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();


module.exports.create = (event, context, callback) => {
    const id = uuid.v4();
    const { firstName } = JSON.parse(event.body);
    const { lastName } = JSON.parse(event.body);
    const { managerEmail } = JSON.parse(event.body);
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
            managerEmail,
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

    var notifyAdmin =
    {   QueueUrl: process.env.My_Queue_URL,
        MessageBody: JSON.stringify({
            to: managerEmail,
            from: managerEmail,
            content: 'New user' + ' ' + firstName + ' ' + lastName + ' ' + 'at'+ ' '  + site + ' ' + 'created.',
            subject: 'New User Created' + ' '  + firstName,
        }),
        
    };
    console.log(notifyAdmin);
    sqs.sendMessage(notifyAdmin, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }

    });

    /*sqs.sendMessage({
        QueueUrl: process.env.My_Queue_URL,
        MessageBody: JSON.stringify({
            to: managerEmail,
            from: managerEmail,
            content: 'New user' + firstName + ' ' + lastName + 'at' + site + 'created.',
            subject: 'New user created ' + firstName,
        }),
    });*/

    

    console.log(notifyAdmin);

};
