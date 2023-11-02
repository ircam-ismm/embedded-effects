export function process(audioContext, input, output) {

  const osc = audioContext.createOscillator();
  osc.frequency.value = 1000;
  
  osc.connect(output);
  osc.start();
}