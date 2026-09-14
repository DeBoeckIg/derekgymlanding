const menuButton=document.querySelector('.menu-toggle');const nav=document.getElementById('main-menu');const toast=document.querySelector('.toast');
if(!menuButton||!nav) { console.warn('Primary navigation is missing'); }
if(!menuButton||!nav) { /* Keep non-navigation pages safe. */ } else {
const setMenuState=open=>{nav.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.setAttribute('aria-hidden',String(!open));};
setMenuState(false);
menuButton.addEventListener('click',()=>setMenuState(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenuState(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){setMenuState(false);menuButton.focus();}});
}
if('IntersectionObserver' in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:0});document.querySelectorAll('.reveal,.trainer-card').forEach(el=>revealObserver.observe(el));}
const sectionLinks=nav?[...nav.querySelectorAll('.nav-links a')]:[];const trackedSections=sectionLinks.map(link=>document.querySelector(link.hash)).filter(Boolean);
if(trackedSections.length){const activeObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(link=>{const active=link.hash===`#${entry.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}})},{rootMargin:'-35% 0px -55% 0px',threshold:0});trackedSections.forEach(section=>activeObserver.observe(section));}
let scrollReset;window.addEventListener('scroll',()=>{document.body.classList.add('is-scrolling');window.clearTimeout(scrollReset);scrollReset=window.setTimeout(()=>document.body.classList.remove('is-scrolling'),140)},{passive:true});
document.querySelectorAll('.plan-btn').forEach(button=>button.addEventListener('click',()=>{if(!toast)return;toast.textContent='¡Excelente elección! Escribinos para activar tu plan.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}));
document.querySelectorAll('h3').forEach(heading=>{if(heading.textContent==='Profesores capacitado')heading.textContent='Profesores capacitados';});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
