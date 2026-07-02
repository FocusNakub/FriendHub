
let projectData = null;
let flow = [];

async function loadProject(){
  try{
    const res = await fetch("project.json", { cache: "no-store" });
    projectData = await res.json();
    renderHero();
    renderShowcase("lobby");
    renderShowcase("gameplay");
    renderFlow();
    renderPatch();
  }catch(err){
    console.error(err);
    document.body.insertAdjacentHTML("afterbegin", '<div style="padding:14px;background:#7f1d1d;color:white">โหลด project.json ไม่สำเร็จ</div>');
  }
}

function renderHero(){
  document.getElementById("kicker").textContent = projectData.kicker;
  document.getElementById("heroTitle").innerHTML = projectData.titleHtml;
  document.getElementById("heroText").textContent = projectData.heroText;
  document.getElementById("stats").innerHTML = projectData.stats.map(s => `
    <div class="stat"><b>${s.value}</b><span>${s.label}</span></div>
  `).join("");
}

function renderShowcase(type){
  const items = projectData.showcases[type] || [];
  if(!items.length) return;
  const bigImg = document.getElementById(type + "BigImg");
  const title = document.getElementById(type + "Title");
  const text = document.getElementById(type + "Text");
  const gallery = document.getElementById(type + "Gallery");

  function select(item, index){
    bigImg.className = "big-image " + item.img;
    title.textContent = item.title;
    text.textContent = item.text;
    bigImg.onclick = () => openLightbox(item.title, item.text, item.img);
    [...gallery.children].forEach((c,i)=>c.classList.toggle("active", i === index));
  }

  gallery.innerHTML = items.map((item, i) => `
    <div class="side-card ${i===0?'active':''}" data-index="${i}">
      <div class="thumb ${item.img}"></div>
      <h4>${item.title}</h4>
      <p>${item.text}</p>
    </div>
  `).join("");

  [...gallery.children].forEach((card, i) => {
    card.onclick = () => select(items[i], i);
  });

  select(items[0], 0);
}

function renderFlow(){
  flow = projectData.flow || [];
  const flowGrid = document.getElementById("flowGrid");
  flowGrid.innerHTML = flow.map((f,i)=>`
    <div class="flow-card" onclick="selectFlow(${i},this)">
      <div class="num">${i+1}</div>
      <div class="thumb ${f.img}"></div>
      <h4>${f.title}</h4>
    </div>
  `).join("");
  selectFlow(0, document.querySelector(".flow-card"));
}

function selectFlow(i, el){
  document.querySelectorAll(".flow-card").forEach(c=>c.classList.remove("active"));
  if(el) el.classList.add("active");
  const f = flow[i];
  if(!f) return;

  const img = document.getElementById("flowDetailImg");
  img.classList.add("changing");

  setTimeout(() => {
    img.className = "flow-preview-image " + f.img;
    document.getElementById("flowDetailTitle").textContent = f.title;
    document.getElementById("flowDetailText").textContent = f.text;
    document.getElementById("flowDetailList").innerHTML = f.items.map(x => `<div class="item">✅ ${x}</div>`).join("");
    img.classList.remove("changing");
  }, 130);
}

function renderPatch(){
  document.getElementById("currentBuild").textContent = `${projectData.version} ${projectData.status}`;
  document.getElementById("progressText").textContent = `${projectData.progress}%`;
  document.getElementById("progressBar").style.width = `${projectData.progress}%`;

  document.getElementById("statusList").innerHTML = projectData.statusItems.map(item => `
    <div class="roadmap-item">
      <b class="${item.className}">${item.icon} ${item.title}</b>${item.description}
    </div>
  `).join("");

  document.getElementById("patchList").innerHTML = projectData.patchNotes.map(p => `
    <div class="patch-item">
      <b>${p.version}</b>${p.changes.join("<br>")}
    </div>
  `).join("");

  document.getElementById("blogList").innerHTML = projectData.devBlog.map(b => `
    <div class="blog-item"><b>${b.title}</b>${b.text}</div>
  `).join("");
}

function openLightbox(title,text,img){
  document.getElementById("lightboxTitle").textContent = title;
  document.getElementById("lightboxText").textContent = text;
  document.getElementById("lightboxImg").className = "lightbox-img " + img;
  document.getElementById("lightbox").classList.add("open");
}

function closeLightbox(){
  document.getElementById("lightbox").classList.remove("open");
}

document.addEventListener("keydown", e => { if(e.key === "Escape") closeLightbox(); });
loadProject();
