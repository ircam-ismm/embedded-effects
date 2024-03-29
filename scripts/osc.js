export function process(audioContext, input, output) {

  const osc = audioContext.createOscillator();
  osc.frequency.value = 250;
  
  osc.connect(output);
  osc.start();
}