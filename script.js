(() => {
  'use strict';
  const items = {
    projects: { number: '01 / 06', symbol: '⌘', title: 'Projects', description: 'Ideas become more interesting when you build them. Explore the code and experiments taking shape on GitHub.', link: 'https://github.com/stackdepth54?tab=repositories', label: 'Explore repositories' },
    code: { number: '02 / 06', symbol: '</>', title: 'Code', description: 'A place for making, problem solving, and learning one line at a time. Follow along with the work on GitHub.', link: 'https://github.com/stackdepth54/CSCI', label: 'Explore CSCI on GitHub' },
    ai: { number: '03 / 06', symbol: '✳', title: 'Artificial intelligence', description: 'Curiosity about intelligent systems, new tools, and the possibilities that emerge when people and technology work together.' },
    math: { number: '04 / 06', symbol: '∑', title: 'Mathematics', description: 'Patterns, logic, and the ideas that connect abstract questions to the world around us.' },
    baseball: { number: '05 / 06', symbol: '◉', title: 'Baseball', description: 'A reminder that there is always more to the story than what happens on a screen.' },
    connect: { number: '06 / 06', symbol: '↗', title: 'Let’s connect', description: 'Interested in the work or have an idea to share? Find me on GitHub and explore what I’m building.', link: 'https://github.com/stackdepth54', label: 'Visit GitHub profile' }
  };
  const dialog = document.querySelector('#detail');
  const buttons = [...document.querySelectorAll('.node')];
  let lastFocus;
  function openNode(button) {
    const item = items[button.dataset.node];
    lastFocus = button;
    dialog.querySelector('.dialog-symbol').textContent = item.symbol;
    dialog.querySelector('.dialog-number').textContent = item.number;
    dialog.querySelector('#detail-title').textContent = item.title;
    dialog.querySelector('#detail-description').textContent = item.description;
    const extra = dialog.querySelector('#detail-extra');
    extra.replaceChildren();
    if (item.link) {
      const link = document.createElement('a');
      link.href = item.link; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = `${item.label} ↗`; extra.append(link);
    }
    dialog.showModal();
  }
  buttons.forEach(button => button.addEventListener('click', () => openNode(button)));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => lastFocus?.focus());
  document.addEventListener('keydown', event => {
    if (!event.key.startsWith('Arrow') || dialog.open || !buttons.includes(document.activeElement)) return;
    const directions = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};
    const [dx,dy] = directions[event.key] || [0,0];
    const from = document.activeElement.getBoundingClientRect();
    const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
    let best, score = Infinity;
    buttons.forEach(button => { if(button === document.activeElement) return; const r=button.getBoundingClientRect(), x=r.left+r.width/2-cx, y=r.top+r.height/2-cy, forward=x*dx+y*dy; if(forward <= 0) return; const s=Math.hypot(x,y) + Math.abs(x*dy-y*dx)*1.5; if(s<score){score=s;best=button;} });
    if(best){event.preventDefault();best.focus();}
  });
  const canvas = document.querySelector('#space'), ctx = canvas.getContext('2d');
  const motionButton = document.querySelector('#motion');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduce.matches, width, height, dpr, particles = [], raf, tick = 0;
  function setMotion() { document.body.classList.toggle('paused',paused); motionButton.setAttribute('aria-pressed',String(paused)); motionButton.innerHTML = paused ? 'RESUME MOTION <span>▶</span>' : 'PAUSE MOTION <span>Ⅱ</span>'; cancelAnimationFrame(raf); draw(); }
  motionButton.addEventListener('click', () => { paused = !paused; setMotion(); });
  reduce.addEventListener?.('change', e => { paused = e.matches; setMotion(); });
  function resize(){width=canvas.clientWidth;height=canvas.clientHeight;dpr=Math.min(devicePixelRatio || 1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(100,Math.floor(width*height/12000));particles=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.1+.3,phase:Math.random()*6.28,speed:Math.random()*.3+.1}));if(paused)draw();}
  function center(el){const c=canvas.getBoundingClientRect(), r=el.getBoundingClientRect();return {x:r.left+r.width/2-c.left,y:r.top+r.height/2-c.top};}
  function draw(){ctx.clearRect(0,0,width,height);const centerPoint=center(document.querySelector('.center-orb'));const points=buttons.map(b=>center(b.querySelector('.orb')));ctx.lineWidth=.7;points.forEach((p,i)=>{const grad=ctx.createLinearGradient(centerPoint.x,centerPoint.y,p.x,p.y);grad.addColorStop(0,'rgba(61,181,255,.30)');grad.addColorStop(1,'rgba(112,201,255,.24)');ctx.strokeStyle=grad;ctx.beginPath();ctx.moveTo(centerPoint.x,centerPoint.y);ctx.lineTo(p.x,p.y);ctx.stroke();const t=(tick*.003+i*.17)%1;ctx.fillStyle='rgba(160,239,255,.85)';ctx.shadowColor='#4fcaff';ctx.shadowBlur=9;ctx.beginPath();ctx.arc(centerPoint.x+(p.x-centerPoint.x)*t,centerPoint.y+(p.y-centerPoint.y)*t,1.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});particles.forEach(p=>{const y=(p.y+Math.sin(tick*.008*p.speed+p.phase)*6);ctx.fillStyle=`rgba(124,196,255,${.2+(Math.sin(tick*.015+p.phase)+1)*.17})`;ctx.beginPath();ctx.arc(p.x,y,p.r,0,Math.PI*2);ctx.fill()});if(!paused){tick++;raf=requestAnimationFrame(draw)}}
  addEventListener('resize',resize,{passive:true});resize();setMotion();
})();
