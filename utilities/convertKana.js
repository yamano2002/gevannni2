export function katakana2hiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

export function hiragana2katakana(str) {
  return str.replace(/[\u3041-\u3096]/g, match => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}
