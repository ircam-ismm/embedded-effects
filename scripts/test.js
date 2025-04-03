import initializeWamHost from '@webaudiomodules/sdk/src/initializeWamHost.js';
import WAM from 'wam-community/dist/plugins/wimmics/stonephaser/index.js';
// import WAM from 'wam-community/dist/plugins/wimmics/WAMAutoWahMB/index.js';

export async function buildGraph(audioContext, input, output) {
  console.log('>> execute buildGraph');
  console.log(WAM);

  const [ hostGroupId ] = await initializeWamHost(audioContext);
  console.log('>> hostGroupId:', hostGroupId);
  let instance;
  try {
    instance = await WAM.createInstance(hostGroupId, audioContext);
  } catch (err) {
    console.log(err.message.slice(0, 100));
    return;
  }

  console.log('++ WAM OK:', instance.descriptor.name, instance.audioNode);
  input.connect(instance.audioNode).connect(output);
}
