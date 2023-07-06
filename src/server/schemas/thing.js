export default {
  id: {
    type: 'string',
    default: ''
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
  vizData: {
    type: 'any',
    default: null,
    nullable: true
  },
  inputGain: {
    type: 'float',
    default: 1.,
  },
  selectedScript: {
    type: 'string',
    default: null,
    nullable: true,
  },
}