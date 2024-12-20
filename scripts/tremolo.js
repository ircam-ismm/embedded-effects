export function process(audioContext, input, output) {

  const frequency = 5;
  const depth = 0.9; // this value will control both tremolo and depth nodes

  const tremolo = audioContext.createGain(); // the gain that will be modulated [0, 1]
  tremolo.gain.value = 1 - depth / 2;

  // scale mod oscillator to make sure `depth + tremolo` stays in the [0, 1] range
  // `depth` should stay between [0, 0.5] -> therefore producing a sine [-0.5, 5]
  // `tremolo` should be complementary between [1, 0.5]
  const depthNode = audioContext.createGain();
  depthNode.gain.value = depth / 2;
  depthNode.connect(tremolo.gain);

  const mod = audioContext.createOscillator();
  mod.frequency.value = frequency;
  mod.connect(depthNode); //

  mod.start();

  input.connect(tremolo).connect(output);
}
