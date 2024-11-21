export function buildGraph(audioContext, input, output) {
  const delayTime = 0.5;
  const feedback = 0.9;
  const preGain = 0.8;

  // direct sound
  input.connect(output);

  // feedback delay
  const preGainNode = audioContext.createGain();
  preGainNode.gain.value = preGain;
  input.connect(preGainNode);

  const delayNode = audioContext.createDelay(5);
  delayNode.delayTime.value = delayTime;
  preGainNode.connect(delayNode);

  const feedbackNode = audioContext.createGain();
  feedbackNode.gain.value = feedback;
  delayNode.connect(feedbackNode);
  feedbackNode.connect(output);
  feedbackNode.connect(delayNode);
}
