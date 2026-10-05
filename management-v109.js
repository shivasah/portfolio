/* v109: the exploration images remain readable links without JavaScript. */
(() => {
  'use strict';
  const links=[...document.querySelectorAll('[data-mr-image]')];
  if(!links.length||typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');
  dialog.className='mr-image-dialog';dialog.setAttribute('aria-labelledby','mr-image-dialog-title');
  dialog.innerHTML='<header><h2 id="mr-image-dialog-title"></h2><button type="button" aria-label="Close image">Close</button></header><img alt="">';
  document.body.appendChild(dialog);
  const image=dialog.querySelector('img');const title=dialog.querySelector('h2');
  let opener=null,previousOverflow='';
  links.forEach(link=>{
    link.setAttribute('aria-haspopup','dialog');
    link.addEventListener('click',event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();opener=link;
      image.src=link.href;image.alt=link.querySelector('img').alt;
      title.textContent=link.dataset.caption||image.alt;
      previousOverflow=document.documentElement.style.overflow;
      document.documentElement.style.overflow='hidden';
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{
    document.documentElement.style.overflow=previousOverflow;
    opener?.focus({preventScroll:true});
  });
})();
