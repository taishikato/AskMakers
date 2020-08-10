const lineMaxString = 23;
const lineHeight = 51;
// const maxLine = 5;
const maxText = 115;

export default (text: string): string => {
  let res = '';

  let textTobeFormet = text;

  if (textTobeFormet.length > maxText)
    textTobeFormet = `${textTobeFormet.slice(0, 113)}…`;

  const lineNumber = textTobeFormet.length / lineMaxString;
  for (let i = 0; i < lineNumber; i++) {
    const height = i * lineHeight;
    const start = i * lineMaxString;
    let extractedText = textTobeFormet.substr(start, lineMaxString);
    const checkNext = textTobeFormet.substr(start + lineMaxString, 1);
    if (checkNext !== ' ' && checkNext !== '') extractedText += '-';
    res += `<tspan x="0" y="${height}" class="st7 st8 st9">${extractedText}</tspan>`;
  }

  return res;
};
