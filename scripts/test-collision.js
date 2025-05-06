import initializeWamHost from '@webaudiomodules/sdk/src/initializeWamHost.js';
// import WAM from 'wam-community/dist/plugins/wimmics/stonephaser/index.js';
import WAMWah from '../plugins/WAMAutoWahMB/index.js';
import WAMCollisionDrive from '../plugins/WAMCollisionDriveMB/index.js';


/*
{
  '/AUtoWahMB/Autowah_Level': {
    id: '/AUtoWahMB/Autowah_Level',
    label: '/AUtoWahMB/Autowah_Level',
    type: 'float',
    defaultValue: 0.5,
    minValue: 0,
    maxValue: 1,
    discreteStep: 0,
    exponent: 0,
    choices: [],
    units: ''
  },
  '/AUtoWahMB/bypass': {
    id: '/AUtoWahMB/bypass',
    label: '/AUtoWahMB/bypass',
    type: 'float',
    defaultValue: 0,
    minValue: 0,
    maxValue: 1,
    discreteStep: 0,
    exponent: 0,
    choices: [],
    units: ''
  }
*/

export async function getDescription() {
  // return shared state class description
  // cf. https://soundworks.dev/soundworks/global.html#SharedStateClassDescription
  return {
    '/AUtoWahMB/Autowah_Level': {
      type: 'float',
      default: 0.5,
      min: 0,
      max: 1,
    },
    '/AUtoWahMB/bypass': {
      type: 'float',
      default: 0,
      min: 0,
      max: 1,
    },

  };
}

export async function buildGraph(audioContext, state, input, output) {
  console.log('>> execute buildGraph');
  // console.log(WAMCollisionDrive);

  const [hostGroupId] = await initializeWamHost(audioContext);
  console.log('>> hostGroupId:', hostGroupId);
  let instanceAutoWah, instanceCollisionDrive;
  try {
    instanceCollisionDrive = await WAMCollisionDrive.createInstance(hostGroupId, audioContext);
    instanceAutoWah = await WAMWah.createInstance(hostGroupId, audioContext);
  } catch (err) {
    console.log(err);
    console.log(err.message.slice(0, 200));
    return;
  }

  console.log('++ WAM OK:', instanceAutoWah.descriptor.name, instanceAutoWah.audioNode);

  console.log(await instanceCollisionDrive.audioNode.getParameterInfo());

  const inputGain = audioContext.createGain();
  inputGain.gain.value = 5; // Mix dry and wet signals

  input.connect(inputGain)
       .connect(instanceCollisionDrive.audioNode)
       .connect(instanceAutoWah.audioNode)
       .connect(output);

  // bind state updates to audio nodes
  state.onUpdate(updates => {
    const now = audioContext.currentTime;

    for (let [key, value] of Object.entries(updates)) {
      switch (key) {
        case '/AUtoWahMB/Autowah_Level': {
          instanceAutoWah.audioNode.setParameterValues({
              '/AUtoWahMB/Autowah_Level': {
                value: value
              }
            });
          break;
        }
        case '/AUtoWahMB/bypass': {
          instanceAutoWah.audioNode.setParameterValues({
            '/AUtoWahMB/bypass': {
              value: value
            }
          });
          break;
        }

      }
    }
  }, true);
}


export async function cleanup() {
  // nothing to cleanup in this script...
}