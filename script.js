'use strict';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dialog = document.querySelector('#art-dialog');
const dialogImage = document.querySelector('#art-image');
let lastTrigger;
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    lastTrigger = button;
    document.querySelector('#art-title').textContent = button.dataset.title;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img').alt;
    document.querySelector('#art-description').textContent = button.dataset.description;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; lastTrigger?.focus({preventScroll:true}); });
const demoButton = document.querySelector('#run-demo');
const steps = [...document.querySelectorAll('.steps li')];
const demoStatus = document.querySelector('#demo-status');
const stepText = ['O agente identifica a finalidade e os requisitos da solicitação.', 'O fluxo prevê consulta às regras operacionais e à disponibilidade.', 'A solicitação é organizada com suas etapas e pendências.', 'Conferências e exceções são encaminhadas às pessoas responsáveis.'];
const pause = duration => new Promise(resolve => window.setTimeout(resolve, duration));
demoButton.addEventListener('click', async () => {
  demoButton.disabled = true;
  demoButton.textContent = 'Fluxo em andamento…';
  steps.forEach((step, index) => { step.className = ''; step.querySelector('.step-icon').textContent = String(index+1).padStart(2, '0'); step.querySelector('em').textContent = 'Aguardando'; });
  for (const [index, step] of steps.entries()) {
    step.classList.add('active');
    step.querySelector('em').textContent = 'Em foco';
    demoStatus.textContent = stepText[index];
    await pause(reduceMotion ? 350 : 1500);
    step.classList.remove('active');
    step.classList.add('done');
    step.querySelector('em').textContent = 'Concluído';
    step.querySelector('.step-icon').textContent = '✓';
  }
  demoStatus.textContent = 'Fluxo ilustrado: solicitação → consulta → organização → validação.';
  demoButton.textContent = 'Rever o fluxo ↻';
  demoButton.disabled = false;
});
if ('IntersectionObserver' in window && !reduceMotion) {
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}); }, {threshold: .08});
  document.querySelectorAll('.about>div,.project,.technical-card,.resume-grid>article,.agent-grid>div,.ia-experience').forEach(element => {element.classList.add('reveal');observer.observe(element);});
}
