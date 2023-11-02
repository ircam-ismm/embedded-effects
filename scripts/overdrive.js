const curve = new Float32Array(1024);
// populate with cosine portion [pi, 2pi]
for (let i = 0; i < curve.length; i++) {
  const phase = Math.PI + i / (curve.length - 1) * Math.PI;
  // const value = (Math.cos(phase) + 1) / 2;
  const value = Math.cos(phase);
  curve[i] = value;
}

export function process(audioContext, input, output) {
  const postGain = audioContext.createGain();
  postGain.gain.value = 0.01;
  postGain.connect(output);

  const waveshaper = audioContext.createWaveShaper();
  waveshaper.connect(postGain);
  waveshaper.curve = curve;

  const preGain = audioContext.createGain();
  preGain.gain.value = 100;
  preGain.connect(waveshaper);

  input.connect(preGain);
}
