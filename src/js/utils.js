export function getFontSize (ele) {
  return Number(document.defaultView.getComputedStyle(ele).fontSize.replace('px', ''));
}

export function optimizeFontSize ({
  diff = 0,
  ele,
  innerWidth,
  defaultFontSize
}) {
  // childEle の親要素の padding が左右で 2% ずつなのを考慮
  let spanRatio = ele.clientWidth / (innerWidth * 0.90);
  let fontSize = getFontSize(ele);
  if (diff >= 0 && spanRatio >= 1) {
    fontSize = fontSize / spanRatio;
    ele.style.fontSize = `${fontSize}px`;
  } else if (diff <= 0 && spanRatio < 1) {
    fontSize = fontSize / spanRatio < defaultFontSize ? fontSize /spanRatio : defaultFontSize;
    ele.style.fontSize = `${fontSize}px`;
  }
}
