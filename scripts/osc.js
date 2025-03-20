export function buildGraph(audioContext, input, output) {
  const osc = audioContext.createOscillator();
  osc.type = "sine"
  osc.frequency.value = 400;

  osc.connect(output);
  osc.start();
}
