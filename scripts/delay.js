export function process(audioContext, input, output) {
  //your script here
  // !! beware of feedback !!
  const delay = audioContext.createDelay(5);
  delay.delayTime.value = 1;
  
  const gain = audioContext.createGain();
  gain.gain.value = 0.8;
  
  delay.connect(gain);
  gain.connect(input);
  
  input.connect(output);
  input.connect(delay);
  delay.connect(output);
}
