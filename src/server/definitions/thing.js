export default {
  id: {
    type: 'string',
    default: ''
  },
  monitoring: {
    type: 'boolean',
    default: false,
  },
  vizDataWet: {
    type: 'any',
    default: null,
    nullable: true
  },
  vizDataDry: {
    type: 'any',
    default: null,
    nullable: true
  },

  inputGain: {
    type: 'float',
    default: 1.,
  },
  outputGain: {
    type: 'float',
    default: 1.,
  },
  selectedScript: {
    type: 'string',
    default: null,
    nullable: true,
  },
};
