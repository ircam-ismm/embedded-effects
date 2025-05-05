
export async function getDescription() {
  // return shared state class description
  // cf. https://soundworks.dev/soundworks/global.html#SharedStateClassDescription
  return {
    delay: {
      type: 'float',
      default: 0.5,
      min: 0,
      max: 5,
    },
    feedback: {
      type: 'float',
      default: 0.9,
      min: 0,
      max: 1,
    },
    preGain: {
      type: 'float',
      default: 0.8,
      min: 0,
      max: 1,
    },
  };
}

export async function buildGraph(audioContext, state, input, output) {
  // direct sound
  input.connect(output);

  // feedback delay
  const preGainNode = audioContext.createGain();
  preGainNode.gain.value = state.get('preGain');
  input.connect(preGainNode);

  const delayNode = audioContext.createDelay(5);
  delayNode.delayTime.value = state.get('delay');
  preGainNode.connect(delayNode);

  const feedbackNode = audioContext.createGain();
  feedbackNode.gain.value = state.get('feedback');
  delayNode.connect(feedbackNode);
  feedbackNode.connect(output);
  feedbackNode.connect(delayNode);

  // bind state updates to audio nodes
  state.onUpdate(updates => {
    const now = audioContext.currentTime;

    for (let [key, value] of Object.entries(updates)) {
      switch (key) {
        case 'preGain': {
          preGainNode.gain.setTargetAtTime(value, now, 0.005);
          break;
        }
        case 'delay': {
          delayNode.delayTime.setTargetAtTime(value, now, 0.005);
          break;
        }
        case 'feedback': {
          feedbackNode.gain.setTargetAtTime(value, now, 0.005);
          break;
        }
      }
    }
  }, true);
}

export async function cleanup() {
  // nothing to cleanup in this script...
}
