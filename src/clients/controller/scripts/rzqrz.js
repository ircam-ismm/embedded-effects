export function process(audioContext, input, output) {
  //your script here
  // !! beware of feedback !!
  input.connect(output);
}