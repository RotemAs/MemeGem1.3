'use strict';

const MEMES_KEY = 'memes';
const IMGS_KEY = 'imgs';
var gImgs = loadFromStorage(IMGS_KEY) || [
  {id: 1, url: 'img/1.jpg', keywords: ['trump,funny']},
  {id: 2, url: 'img/2.jpg', keywords: ['happy,puppy,dog']},
  {id: 3, url: 'img/3.jpg', keywords: ['happy,puppy,dog,baby']},
  {id: 4, url: 'img/4.jpg', keywords: ['cat']},
  {id: 5, url: 'img/5.jpg', keywords: ['baby.funny']},
  {id: 6, url: 'img/6.jpg', keywords: ['dude']},
  {id: 7, url: 'img/7.jpg', keywords: ['baby,funny']},
  {id: 8, url: 'img/8.jpg', keywords: ['man']},
  {id: 9, url: 'img/9.jpg', keywords: ['kid', 'funny']},
  {id: 10, url: 'img/10.jpg', keywords: ['obama']},
  {id: 11, url: 'img/12.jpg', keywords: ['haim']},
  {id: 12, url: 'img/13.jpg', keywords: ['cup', 'man']},
  {id: 13, url: 'img/14.jpg', keywords: ['man,matrix']},
  {id: 14, url: 'img/15.jpg', keywords: ['man,circle']},
  {id: 15, url: 'img/16.jpg', keywords: ['man,old']},
  {id: 16, url: 'img/ZINA.PNG', keywords: ['Yanna,Zina']},
];

var gId = gImgs.length + 1;

var gKeyWordsMap = {trump: 0, funny: 0, dog: 0, cat: 0};

var gStickers = [
  '😇',
  '🧡',
  '😍',
  '😎',
  '😥',
  '😁',
  '😆',
  '🥶',
  '🥳',
  '🐽',
  '👀',
  '👄',
  '🧠',
  '🦾',
];

var gMemes = loadFromStorage(MEMES_KEY) || [];

function getImgs() {
  return gImgs;
}

function getMemes() {
  return gMemes;
}

function getImgById(imgId) {
  return gImgs.find((img) => img.id === imgId);
}

function getLastId() {
  return gId;
}

function createImg(url) {
  let img = {
    id: gId++,
    url,
    keywords: ['new'],
  };
  gImgs.push(img);
  _saveImgsToStorage();
  return img.id;
}

function createMeme(imgId) {
  let meme = {
    selectedImgId: +imgId,
    selectedLineIdx: 0,
    id: makeId(),
    dataUrl: '',
    lines: [
      {
        txt: 'I never eat Falafel',
        size: 25,
        align: 'left',
        font: 'impact',
        stroke: 'black',
        color: 'white',
        x: 50,
        y: 50,
      },
      {
        txt: 'And I Lke IT ',
        size: 25,
        align: 'left',
        font: 'impact',
        stroke: 'black',
        color: 'white',
        x: 50,
        y: 250,
      },
      
    ],
  };
  gMemes.push(meme);
  return meme;
}

function createNewLine() {
  let line = {
    txt: 'I never eat Falafel',
    size: 30,
    align: 'left',
    font: 'impact',
    stroke: 'black',
    color: 'white',
    x: 50,
    y: 150,
  };
  return line;
}


function createNewSticker(txt) {
  let sticker = {
    txt,
    size: 30,
    stroke: 'black',
    color: 'white',
    x: 50,
    y: 150,
  };
  return sticker;
}

function getStickers(idx) {
  const selecteds = [];
  let maxIdx = idx * 2;
  if (maxIdx >= gStickers.length - 1) return selecteds;
  let minIdx = maxIdx - 2;
  for (let i = minIdx; i <= maxIdx; i++) {
    selecteds.push(gStickers[i]);
  }
  return selecteds;
}

function getStickersLength() {
  return gStickers.length;
}

function addSticker(sticker, memeId) {
  let meme = getMemeById(memeId);
  meme.lines.push(createNewSticker(sticker));
  
}

function getMemeById(memeId) {
  return gMemes.find((meme) => meme.id === memeId);
}

function updateText(inputText, memeId) {
  let meme = getMemeById(memeId);
  if (!meme.lines.length) return;
  meme.lines[meme.selectedLineIdx].txt = inputText;
}

function updateSize(diff, lineIdx, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[lineIdx].size += diff * 10;
}

function moveTextByDiff(diff, lineIdx, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[lineIdx].y += diff * 10;
}

function addLine(memeId) {
  let meme = getMemeById(memeId);
  meme.lines.push(createNewLine());
  meme.selectedLineIdx = meme.lines.length - 1;
}

function removeLine(memeId) {
  let meme = getMemeById(memeId);
  if (!meme.lines.length) return;
  meme.lines.splice(meme.selectedLineIdx, 1);
  meme.selectedLineIdx = meme.lines.length - 1;
}

function alignLeft(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x = 15;
}

function alignRight(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x =
    285 - meme.lines[meme.selectedLineIdx].lineWidth;
}

function alignCenter(memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x =
    150 - meme.lines[meme.selectedLineIdx].lineWidth / 2;
}

function setLineColor(memeId, color) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].color = color;
}

function setLineStrokeColor(memeId, color) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].stroke = color;
}

function setFont(font, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].font = font;
  renderCanvas()
}

function setSelectedImg(imgId, memeId) {
  let meme = getMemeById(memeId);
  meme.selectedImgId = +imgId;
}

function setSelectedLineIdx(idx, memeId) {
  let meme = getMemeById(memeId);
  if (idx >= meme.lines.length) idx = 0;
  meme.selectedLineIdx = idx;
  return meme.selectedLineIdx;
}

function saveMeme() {
  _saveMemesToStorage();
}


function updateDataUrl(dataUrl, memeId) {
  let meme = getMemeById(memeId);
  meme.dataUrl = dataUrl;
}

function _saveMemesToStorage() {
  saveToStorage(MEMES_KEY, gMemes);
}

function _saveImgsToStorage() {
  saveToStorage(IMGS_KEY, gImgs);
}



function isLineClicked(pos, memeId) {
  let meme = getMemeById(memeId);
  if (!meme.lines.length) return;
   var lineX = meme.lines[meme.selectedLineIdx].x;
  var lineY = meme.lines[meme.selectedLineIdx].y;
  var lineWidth = meme.lines[meme.selectedLineIdx].lineWidth;
  var lineHeight = meme.lines[meme.selectedLineIdx].lineHeight;
  return (
    lineX <= pos.x &&
    lineX + lineWidth >= pos.x &&
    lineY >= pos.y &&
    lineY - lineHeight <= pos.y
  );
  
}

function moveLine(dx, dy, memeId) {
  let meme = getMemeById(memeId);
  meme.lines[meme.selectedLineIdx].x += dx;
  meme.lines[meme.selectedLineIdx].y += dy;
}

function whichLineClicked(pos, memeId) {
  let meme = getMemeById(memeId);
  var lineIdx = -1;
  meme.lines.some((line, idx) => {
    var lineX = line.x;
    var lineY = line.y;
    var lineWidth = line.lineWidth;
    var lineHeight = line.lineHeight;
    if (
      lineX <= pos.x &&
      lineX + lineWidth >= pos.x &&
      lineY >= pos.y &&
      lineY - lineHeight <= pos.y
    ) {
      lineIdx = idx;
      return;
    }
  });

  return lineIdx;
}


function getSortBySearchImgs(searchWord) {
  let lowerCaseWord = searchWord.toLowerCase();
  
  if (gKeyWordsMap[lowerCaseWord] !== undefined) {
    gKeyWordsMap[lowerCaseWord]++;
  }

  let imgs = gImgs.filter((img) => {
    let words = img.keywords;
    return words.some((word) => word.includes(lowerCaseWord));
  });
  return imgs;
}

function getKeyWordsMap() {
  return gKeyWordsMap;
}

function clearFrame(){
  isClickedOff = true;
}