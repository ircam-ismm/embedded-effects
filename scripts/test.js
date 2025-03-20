export async function process(audioContext, input, output) {
    const hostGroupId = await setupWamHost(audioContext);

    //const wamURIReverb = "wam-community/dist/plugins/wimmics/sweetWah/index.js";
    //const reverbInstance = await loadDynamicComponent(wamURIReverb, hostGroupId);

    const wamURIStonePhaser = "wam-community/dist/plugins/wimmics/stonephaser/index.js";
    const stonePhaserInstance = await loadDynamicComponent(wamURIStonePhaser, hostGroupId);

    //const { default: initializeStonePhaser } = await import("@wam-community/dist/plugins/wimmics/stonephaser/index.js");
    //const stonePhaserInstance = await initializeStonePhaser(audioContext, hostGroupId);

    // Build the audio graph
    input.connect(stonePhaserInstance.audioNode);

    stonePhaserInstance.audioNode.connect(output);
}

async function setupWamHost(audioContext) {
    // Init WamEnv, load SDK etc.
	//const { default: initializeWamHost } = await import("https://www.webaudiomodules.com/sdk/2.0.0-alpha.6/src/initializeWamHost.js");
    const { default: initializeWamHost } = await import("@webaudiomodules/sdk/src/initializeWamHost.js");

	const [hostGroupId] = await initializeWamHost(audioContext);

    // hostGroupId is useful to group several WAM plugins together....
    return hostGroupId;
}

async function loadDynamicComponent(wamURI, hostGroupId) {
    try {
    // Import WAM
      const { default: WAM } = await import("wam-community/dist/plugins/wimmics/stonephaser/index.js");
      // Create a new instance of the plugin, pass groupId
      const wamInstance = await WAM.createInstance(hostGroupId, audioContext);

      return wamInstance;
    } catch (error) {
      console.error('Erreur lors du chargement du Web Component :', error);
    }
}
