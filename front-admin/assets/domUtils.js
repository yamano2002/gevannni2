const adjustHeight = (targetId, subElmId) => {
  const subH = document.getElementById(subElmId).clientHeight;
  document.getElementById(targetId).style.height = `calc(100% - ${subH}px)`;
};

export { adjustHeight };
