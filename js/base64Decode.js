// Данный код декодирует base64
function base64Decode(str) {
  const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let decoded = '';
  let bitstream = 0;
  let bits = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '=') {
      break;
    }

    const charIndex = base64.indexOf(str[i]);

    if (charIndex === -1) {
      throw new Error('Invalid character found in Base64 string');
    }

    bitstream = (bitstream << 6) | charIndex;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      decoded += String.fromCharCode((bitstream >> bits) & 0xff);
    }
  }
  return decoded;
}

export default base64Decode;

// const encoded = 'SGVsbG8sIFdvcmxkIQ==';
// const decoded = base64Decode(encoded);
// console.log(decoded);
