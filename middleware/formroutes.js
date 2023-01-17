const express = require("express");
const app = express();
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const twilio = require("twilio");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/submitForm", async (req, res) => {
    // create OAuth2 client
    const oAuth2Client = new OAuth2Client({
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        redirectUri: "YOUR_REDIRECT_URI"
    });

    // generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    // get access token
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    oAuth2Client.setCredentials(tokens);

    // create sheets client
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

    // append form data to sheet
    sheets.spreadsheets.values.append({
        spreadsheetId: "YOUR_SPREADSHEET_ID",
        range: "Sheet1!A1",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        resource: {
            values: [Object.values(req.body)]
        }
    });

    res.send("Form data submitted to Google Sheets");
});

app.post("/sendMessage", (req, res) => {
    const client = new twilio(
        "YOUR_TWILIO_ACCOUNT_SID",
        "YOUR_TWILIO_AUTH_TOKEN"
    );
    const messageContent = `Name: ${req.body.jsonData.name}
    Email: ${req.body.jsonData.email}
    Phone: ${req.body.jsonData.phone}
    Date of Birth: ${req.body.jsonData.dob}
    Preferred Date and Time: ${req.body.jsonData.datetime}
    Options: ${req.body.jsonData.options}
    See You Soon!`;
    client.messages
        .create({
            body: messageContent,
            from: "YOUR_TWILIO_PHONE_NUMBER",
            to: req.body.phone,
        })
        .then(() => {
            sendTwilloMessageSuccess();
        })
        .catch(() => {
            sendTwilloMessageFail();
        });
});



