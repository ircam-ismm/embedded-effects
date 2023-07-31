// inspired by RNBO chorus by Manuel Poletti

export function process(audioContext, input, output) {
  const rate = 3;
  const spreadAmount = 0.6;
  const depth = 4;

  const triL = audioContext.createOscillator();
  triL.type = "triangle";
  triL.frequency.value = rate;
  const triR = audioContext.createOscillator();
  triL.type = "triangle";
  triR.frequency.value = rate;
  
  const constantOne = audioContext.createConstantSource();
  constantOne.offset = 1;

  const scaledTriL = audioContext.createGain();
  scaledTriL.gain.value = 0.5;
  const scaledTriR = audioContext.createGain();
  scaledTriR.gain.value = 0.5;

  const depthGainL = audioContext.createGain();
  depthGainL.gain.value = depth;
  const depthGainR = audioContext.createGain();
  depthGainR.gain.value = depth;

  const spreadDelay = spreadAmount * 0.5 / rate;
  const spreader = audioContext.createDelay(0.5);
  spreader.delayTime.value = spreadDelay;

  const msGainL = audioContext.createGain();
  msGainL.gain.value = 1/1000;
  const msGainR = audioContext.createGain();
  msGainR.gain.value = 1/1000;
  
  const delayL = audioContext.createDelay(0.05);
  const delayR = audioContext.createDelay(0.05);

  const gainLowFreqL = audioContext.createGain();
  gainLowFreqL.gain.value = 200 / depth;
  const gainLowFreqR = audioContext.createGain();
  gainLowFreqR.gain.value = 200 / depth;
  const gainHighFreqL = audioContext.createGain();
  gainHighFreqL.gain.value = 19000 / depth;
  const gainHighFreqR = audioContext.createGain();
  gainHighFreqR.gain.value = 19000 / depth;

  const lowFilterL = audioContext.createBiquadFilter();
  lowFilterL.type = 'lowpass';
  lowFilterL.frequency.value = 50;
  const lowFilterR = audioContext.createBiquadFilter();
  lowFilterR.type = 'lowpass';
  lowFilterR.frequency.value = 50;
  const highFilterL = audioContext.createBiquadFilter();
  highFilterL.type = 'highpass';
  highFilterL.frequency.value = 1000;
  const highFilterR = audioContext.createBiquadFilter();
  highFilterR.type = 'highpass';
  highFilterR.frequency.value = 1000;

  const minus1L = audioContext.createGain();
  minus1L.gain.value = -1;
  const minus1R = audioContext.createGain();
  minus1R.gain.value = -1;

  const attenuation = 0.7 + 0.3 / 5 * depth;
  const endGainL = audioContext.createGain();
  endGainL.gain.value = attenuation;
  const endGainR = audioContext.createGain();
  endGainR.gain.value = attenuation;

  //control path 
  triL.connect(scaledTriL); //OK
  triR.connect(scaledTriR); //OK
  constantOne.connect(scaledTriL); //OK
  constantOne.connect(scaledTriR); //OK

  scaledTriL.connect(depthGainL); //OK
  scaledTriR.connect(spreader); //OK
  spreader.connect(depthGainR); //OK

  depthGainL.connect(msGainL); //OK
  depthGainL.connect(msGainR); //OK

  msGainL.connect(delayL.delayTime); //OK
  msGainR.connect(delayR.delayTime); //OK

  depthGainL.connect(gainHighFreqL); //OK
  depthGainR.connect(gainHighFreqR); //OK
  gainHighFreqL.connect(highFilterL.frequency); //OK
  gainHighFreqR.connect(highFilterR.frequency); //OK

  depthGainL.connect(gainLowFreqL); //OK
  depthGainR.connect(gainLowFreqR); //OK
  gainLowFreqL.connect(lowFilterL.frequency); //OK
  gainLowFreqR.connect(lowFilterR.frequency); //OK
  

  //audio path
  input.connect(highFilterL); //OK
  input.connect(highFilterR); //OK

  highFilterL.connect(lowFilterL); //OK
  highFilterR.connect(lowFilterR); //OK

  lowFilterL.connect(minus1L); //OK
  lowFilterR.connect(minus1R); //OK
  minus1L.connect(delayL); //OK
  minus1R.connect(delayR); //OK

  highFilterL.connect(delayL); //OK
  highFilterR.connect(delayR); //OK

  delayL.connect(endGainL); //OK
  delayR.connect(endGainR); //OK

  //input.connect(endGainL); //OK
  //input.connect(endGainR); //OK

  endGainL.connect(output); //OK
  endGainR.connect(output); //OK

  //starts
  triL.start();
  triR.start();
  constantOne.start();


  //
  const loggedData = new Float32Array(64);
  const logger = audioContext.createAnalyser();
  logger.fftSize = 64;
  
  gainHighFreqL.connect(logger);

  function logData() {
    let max = -1000000;
    let min = 10000000;
    logger.getFloatTimeDomainData(loggedData);
    for (let i = 0; i < 64; i++) {
      max = Math.max(loggedData[i], max);
      min = Math.min(loggedData[i], min);
    }
    console.log(min, max);

    setTimeout(() => logData(), 100);
  }

  logData();

}
