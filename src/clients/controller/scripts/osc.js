export function process(audioContext, input, output) {
  //your script here
  // !! beware of feedback !!
  //input.connect(output);
  const osc = audioContext.createOscillator();
  osc.frequency.value = 220;
  
  osc.connect(output);
  osc.start();
}