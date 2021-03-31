'use strict';
  // Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
 // Set the region 
//AWS.config.update({ region: 'us-east-2' });


module.exports.sendEmail = async event => {

    
    //console.log("Hello" + JSON.parse(event.body));
    const body = JSON.parse(event.body);
    const {to, from, content, subject} = body;
    console.log("ran");
    // Create sendEmail params 
    const params = {
        

        Destination: { 
            
            ToAddresses: [to]
        },
        Message: { 
            Body: { 
                Text: { Data: content}
            },
            Subject: {Data: subject}
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
    catch(error){
        console.log("error sending", error);

    }   
};
