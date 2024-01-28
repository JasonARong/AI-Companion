const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const bodyParser = require('body-parser');

const path = require('path');

let isApiCallInProgress = false;
let firstLoad = true;

// Middleware to parse JSON
app.use(bodyParser.json());
// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));


// Get root, respond with home.html
app.get('/', async (request, response) => {
    response.send( await readFile('./Frontend/home.html', 'utf8') );
});


/* 
 * Character AI & initialize
 */
app.get('/chatAI', async (req, res) => {
  //console.log(isApiCallInProgress)
  if(chat == null && isApiCallInProgress == false){    
    isApiCallInProgress = true;
    chat = await initializeChat();
    isApiCallInProgress = false;
  }
  
  if(chat == null){
    res.send('false');      
  }else{
    res.send('true');  
  }
   
});


const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();
let chat = null;

//characterAI.requester.puppeteerPath = '/Users/apple/.cache/puppeteer/chrome/mac-1108766/chrome-mac/Chromium.app';
//console.log(characterAI.requester.puppeteerPath);
const initializeChat = async () => {
  // Authenticating as a guest (use `.authenticateWithToken()` to use an account)
  //await characterAI.authenticateAsGuest(); // Guest Login
  await characterAI.authenticateWithToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJpc3MiOiJodHRwczovL2NoYXJhY3Rlci1haS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDAwNzI5OTMzNjM2NDUyNjM4NDEiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC5jaGFyYWN0ZXIuYWkvIiwiaHR0cHM6Ly9jaGFyYWN0ZXItYWkudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwNTg4NzIzOSwiZXhwIjoxNzA4NDc5MjM5LCJhenAiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.g_EKAwpHUqqE55rOWWz68PLwx7Dnuvptg0XpRVRpXxoVy-esNPeQ0nTgHM7W35I0hcJcU3KYFjlYZjOka4wfHHODkLeOey7pkyfvVjugYfbzuXBf-VDxcjQM_jllFrVf0HWDkwZvQKEBsAesgt5uDy2uu6UGGHv5005xfL8zLpwm3dabqymfO0vRcZyxf4bIzTUzqHcug9_y8-o7IfbfMS8ndnUDM2nbaNmyqJwEJECu8icyPxBwztyZBjlavjD9Lu89HtItiAPlAO2OaMftNBlDL-WdOuvevA6EO0quTospCj_WOMP0Wtwqa_flep2ob83gfLCf-NM-inF_-T887Q'
  ,'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJnaXZlbl9uYW1lIjoiSmFzb25BUm9uZyIsImZhbWlseV9uYW1lIjoiOTYiLCJuaWNrbmFtZSI6Imphc29uYXJvbmc5NiIsIm5hbWUiOiJKYXNvbkFSb25nIDk2IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0k5azd4bUx4T2dOMkNBT0RDYjJVNjFTVzlkSVR6MnFCenI3T3lOeW9WcUhRPXM5Ni1jIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMS0yMlQwMTozMzo1OC4zOTBaIiwiZW1haWwiOiJqYXNvbmFyb25nOTZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vY2hhcmFjdGVyLWFpLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsImlhdCI6MTcwNTg4NzIzOSwiZXhwIjoxNzA5NDg3MjM5LCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMDA3Mjk5MzM2MzY0NTI2Mzg0MSIsInNpZCI6ImpjY2V6MDA4eXFnbkZvdWVEZVRyRzFSNHJsckM4dFhoIiwibm9uY2UiOiJSUzVSTkhFMVpVTnVRa0pRTldadGJYbFpNVkpQUjBWcFZ6Qm5URGgzV1hKelduSm5ibVYzTlRCcFFnPT0ifQ.oE3SlTvFlm1ZFvoHzt6NVbWHQaIsdlyiJi1H4DbR9ZVjuE1uJgP02mVPWXXoPb1byQhGRoos1guUj7b2yY9acdbWVONP67FTg_2Jre_89SpljB37r0yJyMRgCjR6WxMq3NkzIU7TyTU3IkMvnB4YHVw8LHW8Ij0Xkb9BiLgam7vXl3YQRX-pBcg1lno7o-NfycjWykQnZPIKIRJqIIC4QVMImDjlFPpVNig3KUm1voHOoA5HAzLPKOL3TitmyOpsRf15RuwNq6OC3x4e7wYN_fE30XnhC7yvQEEPOVPws9h17zib6kav9MKRNiMZhcsL87AtXkp-fDMIipFvPDtd2w');

  // Place your character's id here
  //const characterId = "8_1NyR8w1dOXmI1uWaieQcd147hecbdIK7CeEAIrdJw"; //DC mod
  //const characterId = "8omt0S5AMyNSyFPX0AviFvLr0KZhgDp0ZtiAPgSH-iU"; //IRyS
  const characterId = "ikHTzL573gHn_vnFZmMg011ciGofODUXkGhgVEXVSRk" //Nami

  chat = await characterAI.createOrContinueChat(characterId);
  //console.log(characterAI.puppeteerPath);

  return chat;
};

/**
 *  Restart Chat
 */
app.get('/restartChatAI', async (req, res) => {
  //const characterId = "8omt0S5AMyNSyFPX0AviFvLr0KZhgDp0ZtiAPgSH-iU"; //IRyS
  const characterId = "ikHTzL573gHn_vnFZmMg011ciGofODUXkGhgVEXVSRk" //Nami
  chat = await characterAI.createOrContinueChat(characterId);

  if(chat == null){
    res.send('false');      
  }else{
    res.send('true');  
  }
   
});


/*
* Handle POST request to chat to AI
*/
app.post('/chatAI', async (req, res) => {
  try{
    // Retrieve data from the request body
    const { message } = req.body;

    const textResponse = await chatWithAI(message, chat);
    const textResult = textResponse.text;
    // const speechResult = await convertTextToSpeech();
    // res.type('audio/wav');
    res.setHeader('Content-Type', 'text/plain');
    res.send(textResult);
  }
  catch(error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  
});
async function chatWithAI(input, chatObj){
  // Send a message
  const response = await chatObj.sendAndAwaitResponse(input, true);
  console.log(response);
  return response;
}







/*
 *11 labs Text to Speech
 */
// const axios = require('axios');

// async function convertTextToSpeech() {
//   try {
//     const data = JSON.stringify({
//       "text": "hey how are you",
//       "voice_settings": {
//         "similarity_boost": 0.5,
//         "stability": 0.5
//       }
//     });

//     const config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'https://api.elevenlabs.io/v1/text-to-speech/HkGEOnX43srN2Fnciu7O',
//       headers: {
//         'xi-api-key': '01d4d96c7408b8fd75aa68f128f474b3',
//         'content-type': 'application/json'
//       },
//       data: data
//     };

//     const response = await axios.request(config);
//     const buffer = await response.arrayBuffer();
//     const audioBlob = new Blob([buffer], { type: 'audio/wav' });
//     //console.log(JSON.stringify(response.data));
//     return audioBlob;
//   } 
//   catch (error) {
//     console.log(error);
//   }
// }


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App available on port ${PORT}`));