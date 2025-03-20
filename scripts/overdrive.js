const curve = new Float32Array(1024);
// populate with cosine portion [pi, 2pi]
for (let i = 0; i < curve.length; i++) {
  const phase = Math.PI + i / (curve.length - 1) * Math.PI;
  // const value = (Math.cos(phase) + 1) / 2;
  const value = Math.cos(phase);
  curve[i] = value;
}

export function buildGraph(audioContext, input, output) {
  const gain = 50;
  
  const postGain = audioContext.createGain();
  postGain.gain.value = 1 / gain;
  postGain.connect(output);

  const waveshaper = audioContext.createWaveShaper();
  waveshaper.connect(postGain);
  waveshaper.curve = curve;

  const preGain = audioContext.createGain();
  preGain.gain.value = gain;
  preGain.connect(waveshaper);

  input.connect(preGain);
}
