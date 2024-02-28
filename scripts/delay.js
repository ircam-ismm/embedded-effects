export function process(audioContext, input, output) {
  const delayTime = 1;
  const feedback = 0.8;
  //your script here
  // !! beware of feedback !!
  const delay = audioContext.createDelay(5);
  delay.delayTime.value = delayTime;
  
  const gain = audioContext.createGain();
  gain.gain.value = feedback;
  
  delay.connect(gain);
  gain.connect(input);
  
  input.connect(output);
  input.connect(delay);
  delay.connect(output);
}
