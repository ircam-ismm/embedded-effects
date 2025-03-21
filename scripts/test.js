import initializeWamHost from '@webaudiomodules/sdk/src/initializeWamHost.js';
import WAM from 'wam-community/dist/plugins/wimmics/stonephaser/index.js';

export async function buildGraph(audioContext, input, output) {
  // const { default: WAM } = await import('wam-community/dist/plugins/wimmics/stonephaser/index.js');

  console.log('>> execute buildGraph');
  console.log(WAM);

  const [ hostGroupId ] = await initializeWamHost(audioContext);
  console.log('>> hostGroupId:', hostGroupId);
  let instance;
  try {
    // instance = await WAM.createInstance(hostGroupId, audioContext);
    instance = new WAM(hostGroupId, audioContext);
    instance._baseURL = process.cwd() + '/node_modules/wam-community/dist/plugins/wimmics/stonephaser/';
    instance._descriptorUrl = process.cwd() + '/node_modules/wam-community/dist/plugins/wimmics/stonephaser/descriptor.json';
    await instance.initialize({});
  } catch (err) {
    // console.log(err.base.slice(0, 100));
    console.log(err.message.slice(0, 100));
    return;
  }

  console.log('++ WAM OK:', instance.descriptor.name, instance.audioNode);
  input.connect(instance.audioNode).connect(output);
}
