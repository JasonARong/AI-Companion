let input = document.querySelector('#textInput');
let sendTextBtn = document.querySelector('#sendTextBtn');
let output = document.querySelector('output');
let audioPlayer = document.getElementById('audioPlayer');

let startBtn = document.querySelector('#start');
let cancelBtn = document.querySelector('#cancel');
let sendAudioBtn = document.querySelector('#sendAudioBtn');

sendTextBtn.disabled = true;
/**
 * Intialized the chat functionality
 */
const initialization = async () => {
  try{
    let initResult = await axios.get('http://localhost:3000/chatAI'); 
    console.log(initResult);
    console.log(typeof(initResult.data));
    console.log(initResult.data == false);
    if(initResult.data  == false){
      alert('initialized still in progress');
    }else{
      alert('chat initialized');
      sendTextBtn.disabled = false;  
    }
    
  }
  catch (err) {
    console.error(err);
  }  
};
initialization();



/**
 * Function to send message to the back end
 */
const sendMessage = async (input) => {
  sendTextBtn.disabled = true;
  try {
    // User data to be sent in the request body
    const requestContent = {
      message: input
    };

    // Send POST request using Axios
    const response = await axios.post('http://localhost:3000/chatAI', requestContent);
    
    // Log the server response
    console.log(response);
    // Return teh AI text response
    return response.data;

  } catch (error) {
    console.error('Error Sending Message', error);
  }
};



/**
 * Send text input to the backend
 */
sendTextBtn.addEventListener('click', async () => {
  let AItextResponse = await sendMessage(input.value);
  await textToSpeech(AItextResponse);
  output.innerText = AItextResponse;
  sendTextBtn.disabled = false;
});


/**
 * Process audio input and send it to the backend
 */
let textToSend = "";

sendAudioBtn.disabled = true;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.maxAlternatives = 1;

startBtn.addEventListener('click', () => {
  recognition.start();
  textToSend = "";
  startBtn.disabled = true;
});

cancelBtn.addEventListener('click', () => {
  recognition.abort();
  startBtn.disabled = false;
  console.log('abort');
  textToSend = "";
});

sendAudioBtn.addEventListener('click', () => {
  recognition.stop();
});

recognition.addEventListener('result', (e) => {
  let resultsLength = e.results.length -1 ;  // time segment or portion of the user's speech.
  let ArrayLength = e.results[resultsLength].length -1;  // alternative of the result

  let saidWord = e.results[resultsLength][0].transcript;   // get last word detected
  
  if (e.results[resultsLength].isFinal) {
    textToSend += saidWord
  }
  //console.log(saidWord);
});

recognition.addEventListener("speechstart", () => {
  console.log("Speech has been detected");
  sendAudioBtn.disabled = false;
});

recognition.addEventListener('error', (e) => {
  console.log('Error: ' + e.error);
  if (e.error == 'no-speech') {
    alert('no speech detacted');
  }
  if (e.error == 'audio-capture') {
    alert('No microphone was found');
  }
  if (e.error == 'not-allowed') {
    alert('Please enable your microphone');
  }
});

recognition.addEventListener("end", async() => {
  console.log("Speech recognition service disconnected");
  if(textToSend != ''){
    console.log(textToSend);  
    let AItextResponse = await sendMessage(textToSend);
    await textToSpeech(AItextResponse);
    output.innerText = AItextResponse;
  }else{
    console.log('no speech');
  }
  
  sendAudioBtn.disabled = true;
  startBtn.disabled = false;
});

// Disable automatic stopping on pause
recognition.interimResults = true;
recognition.continuous = true;



/**
 * Text to Speech
 * Convert text responde from the server to audio
 */
const textToSpeech = async(inputText) =>{
  inputText = String(inputText).replace(/[^a-zA-Z0-9.,!?-]/g, ' ');;
  console.log(inputText);
  const options = {
    method: 'POST',
    headers: {
      'xi-api-key': '01d4d96c7408b8fd75aa68f128f474b3',
      'Content-Type': 'application/json'
    },
    body: `{
      "voice_settings":{
        "style":0.01,
        "stability":0.40,
        "similarity_boost":0.99,
        "use_speaker_boost":false
      },
      "text":"${inputText}",
      "model_id":"eleven_multilingual_v2"
    }`
  };

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Wg4WNUR6UjsqZySAT54h', options);
    const buffer = await response.arrayBuffer();

    // Assuming you want to play the audio using an HTML5 Audio element
    const audioBlob = new Blob([buffer], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // const audio = new Audio(audioUrl);
    audioPlayer.src = audioUrl;
    audioPlayer.play();
  } catch (err) {
    console.error(err);
  }  
}

// Test
//textToSpeech('HiRis, Its Irys!  Good morning. I am going to play a game today. Are you guys ready?');