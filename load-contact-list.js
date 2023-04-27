// Import required modules
const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, { accountSid: process.env.TWILIO_ACCOUNT_SID, autoRetry: true, maxRetries: 3 });

try {
    // Get the command line arguments, skipping the first two elements
    const args = process.argv.slice(2);

    // Read and process the CSV file passed as an argument
    fs.createReadStream(args[0])
        .pipe(csv())
        .on('data', async (data) => {
            console.log(data);

            const message = await sendSingleMessage(data);
            await registerMessage(data, message);
        });
} catch (err) {
    console.error(err);
}

// Function to send a single message using Twilio Programmable Messaging
const sendSingleMessage = async (contact) => {
    const contentVariables = JSON.stringify(_.omit(contact, 'TEMPLATE', 'PHONE'));
    console.table(contentVariables);

    const contentSid = contact.TEMPLATE;

    const message = await client.messages
        .create({ from: process.env.MESSAGING_SERVICE_SID, contentSid, contentVariables, to: 'whatsapp:' + contact.PHONE })
        .catch(err => {
            console.log(err);
        });

    console.log(`Message ${message.sid} sent to ${contact.PHONE} `);

    return message;
}

// Function to register the message usint Twilio Sync
const registerMessage = async (contact, message) => {
    const mapItem = await client.sync.v1.services(process.env.SYNC_SERVICE_SID)
        .syncMaps(process.env.SYNC_MAP_SID)
        .syncMapItems
        .create({
            key: `${contact.PHONE}_${message.sid}`,
            data: contact
        })
        .catch(err => {
            console.log(err);
        });

    console.log(`Map Item registered with SID ${mapItem.mapSid}`);
}
