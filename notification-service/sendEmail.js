'use strict';
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
//AWS.config.update({ region: 'us-east-2' });


module.exports.sendEmail = async event => {


    console.log(event);
    console.log(JSON.parse(event.Records[0].body));
    console.log(event.Records[0].body.from);
    const { to, from, content, subject } = JSON.parse(event.Records[0].body);
    console.log("ran");
    // Create sendEmail params 
    const params = {


        Destination: {

            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: { Data: content }
            },
            Subject: { Data: subject }
        },
        Source: from
    };
    console.log("ran emails");
    // Create the promise and SES and SQS service object
    try {
        await new AWS.SES().sendEmail(params).promise();
        console.log("ran emails successfull");
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Success!' })


        };
    }
    catch (error) {
        console.log("error sending", error);

    }
};