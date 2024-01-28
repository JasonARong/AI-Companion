//Voice Controls section
let voiceControls = document.querySelector('#voiceControls');
let beforeVoice = document.querySelector('#beforeVoice');
let duringVoice = document.querySelector('#duringVoice');
let switchToKeyboardBtn = document.querySelector('#switchToKeyboard');

//Text Control section
let textControls = document.querySelector('#textControls');
let switchToVoiceBtn = document.querySelector('#switchToVoice');


// Check is variabel to prevent transitionend gets triggered without button clicking
let btnClicked = false;
// Check whether this button is a next or back button
// to prevent transitionend gets triggered by a different button clicking
// false == back; true == next
let backOrNext = false;


// switching from voice to text
switchToKeyboardBtn.addEventListener('click', () =>{
    voiceControls.classList.toggle('fadeOut');
    //textControls.classList.toggle('fadeOut');
    btnClicked = true;
    backOrNext = true;
});
voiceControls.addEventListener('transitionend', () =>{
    if(btnClicked && backOrNext){
        voiceControls.style.display='none';
        textControls.style.display='flex';
        setTimeout(() => {textControls.classList.toggle('fadeOut')}, 0);        
        btnClicked = false;
    }
});

// switching from text to voice
switchToVoiceBtn.addEventListener('click', () =>{
    textControls.classList.toggle('fadeOut');
    btnClicked = true;
    backOrNext = false;
});
textControls.addEventListener('transitionend', () =>{
    if(btnClicked && backOrNext == false){
        textControls.style.display='none';
        voiceControls.style.display='block';
        setTimeout(() => {voiceControls.classList.toggle('fadeOut')}, 0);        
        btnClicked = false;
    }
});

// switching from before voice to during voice
startBtn.addEventListener('click',() => {
    beforeVoice.classList.toggle('fadeOut');
    btnClicked = true;
    backOrNext = true;
});
beforeVoice.addEventListener('transitionend', () => {
    if(btnClicked && backOrNext){
        beforeVoice.style.display='none';
        duringVoice.style.display='flex';
        setTimeout(() => {duringVoice.classList.toggle('fadeOut')}, 0);        
        btnClicked = false;
    }
});

// switching from during voice to before voice
cancelBtn.addEventListener('click',() => {
    duringVoice.classList.toggle('fadeOut');
    btnClicked = true;
    backOrNext = false;
});
duringVoice.addEventListener('transitionend', () => {
    if(btnClicked && backOrNext == false){
        duringVoice.style.display='none';
        beforeVoice.style.display='flex';
        setTimeout(() => {beforeVoice.classList.toggle('fadeOut')}, 0);        
        btnClicked = false;
    }
});

// switching from during voice to before voice
sendAudioBtn.addEventListener('click',() => {
    duringVoice.classList.toggle('fadeOut');
    btnClicked = true;
    backOrNext = false;
});
duringVoice.addEventListener('transitionend', () => {
    if(btnClicked && backOrNext == false){
        duringVoice.style.display='none';
        beforeVoice.style.display='flex';
        setTimeout(() => {beforeVoice.classList.toggle('fadeOut')}, 0);        
        btnClicked = false;
    }
});