# Whatsapp Bulk Send Quickstart

## Solution Description

This Node.js script reads a CSV file, sends a WhatsApp message to each phone number listed in the file using Twilio Programmable Messaging (using a pre-registered Content from the Content API/Editor), and then registers the message using Twilio Sync.

## High Level Architecture

![High Level Architecture](screenshots/Message%20Context%20with%20Content%20API%20and%20Sync%20-%20EN%20(1).png)

## Requirements

### Twilio Features

* [Content API](https://www.twilio.com/docs/content-api) access

### Functions Deployment
* [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) installed
* [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit) installed

### Running the Script
* [Node.js](https://nodejs.org/en/) installed. (**Minimum Version**: Nodejs v12)


## Setup

1. Clone this repository
2. In the root folder, copy the Environment Variables file sample into a production file
    * `cp .env.example .env`
3. Install dependencies
    * `npm install`
4. Setup `.env` with your Twilio Project Service SIDs and WhatsApp Phone Number
   1. [API Key SID and Secret](https://console.twilio.com/)
   2. [Sync Service SID](https://console.twilio.com/us1/develop/sync/services?frameUrl=%2Fconsole%2Fsync%2Fservices%3Fx-target-region%3Dus1)
   3. Create a new Sync Service Map, navigate back to your Sync Service and copy the SID
   4. [WhatsApp Phone Number](https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders?frameUrl=%2Fconsole%2Fsms%2Fwhatsapp%2Fsenders%3Fx-target-region%3Dus1)
5. Navigate to `contact-helper`
    * `cd contact-helper` 
6. Copy the Serverless Application Environment Variables file sample into a production file
    * `cp .env.example .env`
7. Setup `.env` using the same info from the script Environment File, except for the WhatsApp Phone Number
8. Deploy the Twilio Functions
    * `twilio serverless:deploy`

## Running the Script

1. In the root folder, run `node load-contact-list.js [contacts list CSV path]`
2. The CSV file **must** contain the following columns (in any order):
    * PHONE
    * TEMPLATE
    * Template variables with numbers (1,2,3, etc)

## Checking Context

The `get-contact` function expects two parameters:
* **phone**: The sender phone number (**OBS:** Twilio processes WhatsApp phone numbers as `whatsapp:<phone number>`. Don't worry about parsing the number. The function already takes care of this)
* **originalMessageSid**: The Original Message SID. In Studio, it'll be part of the trigger message, in `{{trigger.message.OriginalRepliedMessageSid}}`

## Create New Content

To create new content you can go to the [Content Editor](https://console.twilio.com/us1/develop/sms/content-editor) or use the [Content API](https://www.twilio.com/docs/content-api) directly. Keep in mind that WhatsApp must approve content to be used as outbound messages

## Disclaimer

Beware that this solutions is meant only as a quickstart for bulk sending WhatsApp messages. Keep in mind thar Twilio APIs are rate limited, which means you will need to implement some sort of backoff or pacing logic to avoid `429 errors`.