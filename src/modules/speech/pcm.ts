export function downsampleFloat32(
  input: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array {
  if (fromRate === toRate) {
    return input;
  }

  const ratio = fromRate / toRate;
  const outputLength = Math.round(input.length / ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i += 1) {
    const position = i * ratio;
    const index = Math.floor(position);
    const next = Math.min(index + 1, input.length - 1);
    const fraction = position - index;
    const start = input[index] ?? 0;
    const end = input[next] ?? start;
    output[i] = start * (1 - fraction) + end * fraction;
  }

  return output;
}

export function floatToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);

  for (let i = 0; i < input.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, input[i] ?? 0));
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }

  return output;
}

export function floatChannelToPcm16(
  input: Float32Array,
  fromRate: number,
  toRate: number,
): Uint8Array {
  const downsampled = downsampleFloat32(input, fromRate, toRate);
  const int16 = floatToInt16(downsampled);
  return new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export function pcmBytesToVoiceLevel(bytes: Uint8Array): number {
  const sampleCount = Math.floor(bytes.byteLength / 2);
  if (sampleCount <= 0) {
    return 0;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let sumSquares = 0;

  for (let i = 0; i < sampleCount; i += 1) {
    const sample = view.getInt16(i * 2, true) / 32768;
    sumSquares += sample * sample;
  }

  return rmsToVoiceLevel(Math.sqrt(sumSquares / sampleCount));
}

export function floatToVoiceLevel(input: Float32Array): number {
  if (input.length === 0) {
    return 0;
  }

  let sumSquares = 0;
  for (let i = 0; i < input.length; i += 1) {
    const sample = input[i] ?? 0;
    sumSquares += sample * sample;
  }

  return rmsToVoiceLevel(Math.sqrt(sumSquares / input.length));
}

function rmsToVoiceLevel(rms: number): number {
  if (rms <= 0) {
    return 0;
  }

  const db = 20 * Math.log10(rms);
  return Math.min(1, Math.max(0, (db + 50) / 50));
}
