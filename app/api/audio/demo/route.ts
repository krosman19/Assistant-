function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function createToneWav({ seconds = 3, frequency = 440, sampleRate = 16_000 } = {}) {
  const samples = seconds * sampleRate;
  const bytesPerSample = 2;
  const dataSize = samples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < samples; index += 1) {
    const envelope = Math.min(1, index / 1_600, (samples - index) / 1_600);
    const sample = Math.round(1_600 * envelope * Math.sin((2 * Math.PI * frequency * index) / sampleRate));
    view.setInt16(44 + index * bytesPerSample, sample, true);
  }

  return buffer;
}

export async function GET() {
  return new Response(createToneWav(), {
    headers: {
      'Content-Type': 'audio/wav',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
