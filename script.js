(function(){
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', ()=>{
    header.classList.toggle('scrolled', window.scrollY > 8);
  });

  /* ---- finder sidebar switching ---- */
  const finderItems = document.querySelectorAll('.finder-item');
  const panes = document.querySelectorAll('.finder-pane');

  finderItems.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      finderItems.forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-pane');
      panes.forEach(p=>{
        p.hidden = (p.id !== 'pane-' + target);
      });
    });
  });

  /* ---- envelope + wax seal ---- */
  const envBtn = document.getElementById('envelopeBtn');
  const envelope = document.getElementById('envelope');
  const letterForm = document.getElementById('letterForm');
  const envHint = document.getElementById('envelopeHint');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let opened = false;

  envBtn.addEventListener('click', ()=>{
    opened = !opened;
    envelope.classList.toggle('open', opened);
    envBtn.setAttribute('aria-expanded', String(opened));
    envHint.textContent = opened ? 'close the letter' : 'click the seal to open your letter';
    if(opened){
      setTimeout(()=>{ letterForm.classList.add('show'); }, reduced ? 0 : 500);
    } else {
      letterForm.classList.remove('show');
    }
  });

  letterForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const sent = document.getElementById('sentNote');
    sent.classList.add('show');
  });
})();

  /* ---- sending an email ---- */
  letterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const sent = document.getElementById('sentNote');
  const submitBtn = letterForm.querySelector('.btn-seal'); 
  const formData = new FormData(letterForm);

  // Web3Forms Access Key 
  formData.append("access_key", "09125e1d-9fc8-43c7-91fa-c73737a34e84");

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sealing & sending...";
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      sent.textContent = "✓ Your letter has been sealed & sent!";
      sent.classList.add('show');
      letterForm.reset();
    } else {
      sent.textContent = "✕ Error: " + (data.message || "Failed to send");
      sent.classList.add('show');
    }
  } catch (error) {
    sent.textContent = "✕ Something went wrong. Please try again.";
    sent.classList.add('show');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
