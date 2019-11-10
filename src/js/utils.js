export function getFontSize (ele) {
  return Number(document.defaultView.getComputedStyle(ele).fontSize.replace('px', ''));
}
