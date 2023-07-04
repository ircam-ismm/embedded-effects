export function process(audioContext, input, output) {
  //your script here
  // !! beware of feedback !!
  const osc = audioContext.createOscillator();
  osc.frequency.value = 440;
  
  const gain = audioContext.createGain();
  gain.gain.value = 10;
  
  const amGain = audioContext.createGain();
  
  
  input.connect(gain);
  gain.connect(amGain.gain);
  osc.connect(amGain);
  amGain.connect(output);
  
  osc.start();
}