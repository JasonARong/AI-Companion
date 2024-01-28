let input = document.querySelector('#textInput');
let sendTextBtn = document.querySelector('#sendTextBtn');
let output = document.querySelector('output');
let audioPlayer = document.getElementById('audioPlayer');

let startBtn = document.querySelector('#start');
let cancelBtn = document.querySelector('#cancel');
let sendAudioBtn = document.querySelector('#sendAudioBtn');

let imgAvatar = document.querySelector('#avator');
let statusOutput = document.querySelector('#status');

let wave1 = document.querySelector('.parallax>use:nth-child(1)');
let wave2 = document.querySelector('.parallax>use:nth-child(2)');
let wave3 = document.querySelector('.parallax>use:nth-child(3)');

//let restartBtn = document.querySelector('#restartBtn');

sendTextBtn.disabled = true;
startBtn.disabled = true;
/**
 * Intialized the chat functionality
 */
const initialization = async () => {
  try{
    statusOutput.innerText = 'Initalizaing...'
    let initResult = await axios.get('./chatAI'); 
    console.log(initResult);
    console.log(typeof(initResult.data));
    console.log(initResult.data == false);
    if(initResult.data  == false){
      alert('initialized still in progress');
    }else{
      alert('chat initialized');
      sendTextBtn.disabled = false;
      sendTextBtn.classList.remove('disabled');
      startBtn.disabled = false;
      startBtn.classList.remove('disabled');
    }
    statusOutput.innerText = '';
  }
  catch (err) {
    console.error(err);
    statusOutput.innerText = '';
  }  
};
initialization();



/**
 * Function to send message to the back end
 */
const sendMessage = async (input) => {
  //disable text and start voice btn
  sendTextBtn.disabled = true;
  sendTextBtn.classList.add('disabled');
  startBtn.disabled = true;
  startBtn.classList.add('disabled');
  try {
    // User data to be sent in the request body
    const requestContent = {
      message: input
    };
    statusOutput.innerText = 'Nami is thinking...';
    // Send POST request using Axios
    const response = await axios.post('./chatAI', requestContent);
    
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
  // sendTextBtn.disabled = false;
  // sendTextBtn.classList.remove('disabled');
});


/**
 * Process audio input and send it to the backend
 */
let textToSend = "";

sendAudioBtn.disabled = true;
sendAudioBtn.classList.add('disabled');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.maxAlternatives = 1;

startBtn.addEventListener('click', () => {
  recognition.start();
  textToSend = "";
  startBtn.disabled = true;
  startBtn.classList.add('disabled');
});

cancelBtn.addEventListener('click', () => {
  recognition.abort();
  startBtn.disabled = false;
  startBtn.classList.remove('disabled');
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
  wave1.classList.add('speak');
  wave2.classList.add('speak');
  wave3.classList.add('speak');
  setTimeout(() => {
    wave1.classList.remove('speak');
    wave2.classList.remove('speak');
    wave3.classList.remove('speak');
  }, 1000);   
  //console.log(saidWord);
});

recognition.addEventListener("speechstart", () => {
  console.log("Speech has been detected");
  sendAudioBtn.disabled = false;
  sendAudioBtn.classList.remove('disabled');
  wave1.classList.add('speak');
  wave2.classList.add('speak');
  wave3.classList.add('speak');
  setTimeout(() => {
    wave1.classList.remove('speak');
    wave2.classList.remove('speak');
    wave3.classList.remove('speak');
  }, 1000); 
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


// once the voice recognition is ended, send it to the backend
// wait for response => text to speech => print inside <output>
recognition.addEventListener("end", async() => {
  console.log("Speech recognition service disconnected");
  if(textToSend != ''){
    console.log(textToSend);  
    let AItextResponse = await sendMessage(textToSend);
    await textToSpeech(AItextResponse);
    output.innerText = AItextResponse;
  }else{
    //alert('no speech detacted');
    console.log('no speech');
  }
  
  sendAudioBtn.disabled = true;
  sendAudioBtn.classList.add('disabled');

});

// Disable automatic stopping on pause
recognition.interimResults = true;
recognition.continuous = true;




/**
 * Text to Speech 11 labs
 * Convert text responde from the server to audio
 */
const textToSpeech = async(inputText) =>{
  inputText = String(inputText).replace(/[^a-zA-Z0-9.,!?-]/g, ' ');;
  console.log(inputText);
  statusOutput.innerText = 'Nami is about to say something...';
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

    const audioBlob = new Blob([buffer], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // play audio
    audioPlayer.src = audioUrl;
    audioPlayer.play();

    // start animation
    imgAvatar.classList.add('animate');

    // when voice is played, enable send text and start voice btns
    startBtn.disabled = false;
    startBtn.classList.remove('disabled');
    sendTextBtn.disabled = false;
    sendTextBtn.classList.remove('disabled');
    statusOutput.innerText = '';
  } catch (err) {
    console.error(err);
  }  
}
// Test
//textToSpeech('HiRis, Its Irys!  Good morning. I am going to play a game today. Are you guys ready?');

//end Aimation
audioPlayer.addEventListener("ended", () => {
  imgAvatar.classList.remove('animate');
});

/**
 * Restart after Session ends
 */
// restartBtn.addEventListener('click', async () => {
//   try{
//     let initResult = await axios.get('./restartChatAI'); 
//     console.log(initResult);
//     console.log(typeof(initResult.data));
//     console.log(initResult.data == false);
//     if(initResult.data  == false){
//       alert('initialized still in progress');
//     }else{
//       alert('chat initialized');
//       sendTextBtn.disabled = false;  
//     }
    
//   }
//   catch (err) {
//     console.error(err);
//   }  
// });