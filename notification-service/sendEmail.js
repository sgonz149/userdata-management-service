'use strict';
  // Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
 // Set the region 
//AWS.config.update({ region: 'us-east-2' });

module.exports.sendEmail = async (event) => {
    const { to, from, subject, content } = JSON.parse(event.body);
    console.log("ran");
    // Create sendEmail params 
    const params = {
        Destination: { 
            
            ToAddresses: [
                to
                
            ],
        },
        Message: { 
            Body: { 
                Text: {
                    
                    Data: content
                },
            },
            Subject: {
                
                Data: subject
            },
        },
        Source: from
        
    };
    console.log("ran emails");
    // Create the promise and SES service object
    try {
        await new AWS.SES().sendEmail(params).promise();
        console.log("ran emails successfull");
    }
    catch(error){
        console.log("error sending", error);

    }
    // Handle promise's fulfilled/rejected states

    
};
