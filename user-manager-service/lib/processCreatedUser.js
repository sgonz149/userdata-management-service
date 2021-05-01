'use strict';
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

import { sendEmail } from '../notification-service/sendEmail';
import { createUser } from '../notification-service/createUser';
// Set the region 
//AWS.config.update({ region: 'us-east-2' });


module.exports.processCreatedUser = async event =>
{

    const userInfo = await createUser();
    const userPromises = userInfo.map(info => sendEmail(info));

    await Promise.all(userPromises);
    return { user: userPromises.length };

}

export const handler = processCreatedUser;