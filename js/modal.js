const mdlInfo = document.getElementById('mdlInfo');

mdlInfo.querySelector('button').addEventListener('click', () => {
  mdlInfo.close();
});

export const showModal = (text) => {
  mdlInfo.querySelector('p').textContent = text;
  mdlInfo.showModal();
};
