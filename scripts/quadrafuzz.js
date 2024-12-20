export function process(audioContext, input, output) {
    const lowpassFrequency = 147;
    const midlowpassFrequency = 587;
    const midhighpassFrequency = 2490;
    const highpassFrequency = 4980;
    const distortionAmount = 0.5; // Adjust distortion level

    // Create gain nodes for dry and wet signals
    const dryGain = audioContext.createGain();
    const wetGain = audioContext.createGain();
    dryGain.gain.value = 0.5; // Mix dry and wet signals
    wetGain.gain.value = 0.5;

    const param = audioContext.audioNode

    // Create filters for frequency bands
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = lowpassFrequency;

    const midlowpass = audioContext.createBiquadFilter();
    midlowpass.type = 'midlowpass';
    midlowpass.frequency.value = midlowpassFrequency;

    const midhighpass = audioContext.createBiquadFilter();
    midhighpass.type = 'midhighpass';
    midhighpass.frequency.value = midhighpassFrequency;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = highpassFrequency;

    // Create wave shapers for distortion
    const createDistortion = (amount) => {
        const waveShaper = audioContext.createWaveShaper();
        const curve = new Float32Array(44100);
        for (let i = 0; i < 44100; i++) {
            const x = (i / 44100) * 2 - 1;
            curve[i] = ((3 + amount) * x * 20 * Math.PI) / (Math.PI + amount * Math.abs(x));
        }
        waveShaper.curve = curve;
        waveShaper.oversample = '4x';
        return waveShaper;
    };

    const distortions = [
        createDistortion(distortionAmount),
        createDistortion(distortionAmount),
        createDistortion(distortionAmount),
        createDistortion(distortionAmount),
    ];

    // Connect filters and distortions
    const filters = [lowpass, midlowpass, midhighpass, highpass];
    filters.forEach((filter, index) => {
        wetGain.connect(filter);
        filter.connect(distortions[index]);
        distortions[index].connect(output);
    });

    // Connect dry and wet signals
    input.connect(dryGain);
    input.connect(wetGain);
    dryGain.connect(output);
}