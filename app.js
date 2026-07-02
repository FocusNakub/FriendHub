function setShowcase(type,title,text,img,el){
  document.querySelectorAll('#'+type+' .side-card').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(type+'BigImg').className='big-image '+img;
  document.getElementById(type+'Title').textContent=title;
  document.getElementById(type+'Text').textContent=text;
  document.getElementById(type+'BigImg').onclick=function(){openLightbox(title,text,img)};
}

let flow = [];



function selectFlow(i,el){
  document.querySelectorAll('.flow-card').forEach(c=>c.classList.remove('active'));
  if(el) el.classList.add('active');
  const f=flow[i];
  document.getElementById('flowDetailImg').className='detail-image '+f.img;
  document.getElementById('flowDetailTitle').textContent=f.title;
  document.getElementById('flowDetailText').textContent=f.text;
  document.getElementById('flowDetailList').innerHTML=f.items.map(x=>`<div class="item" onclick="this.classList.toggle('active')">✅ ${x}</div>`).join('');
}

function openLightbox(title,text,img){
  document.getElementById('lightboxTitle').textContent=title;
  document.getElementById('lightboxText').textContent=text;
  document.getElementById('lightboxImg').className='lightbox-img '+img;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});



async function loadProjectData(){
  try{
    const response = await fetch("project.json", { cache: "no-store" });
    const data = await response.json();

    // Hero / meta
    const heroTitle = document.querySelector("h1");
    if(heroTitle && data.gameTitleHtml) heroTitle.innerHTML = data.gameTitleHtml;

    const heroText = document.querySelector(".hero p");
    if(heroText && data.heroText) heroText.textContent = data.heroText;

    const kicker = document.querySelector(".kicker");
    if(kicker && data.kicker) kicker.textContent = data.kicker;

    const stats = document.querySelectorAll(".stat b");
    const statLabels = document.querySelectorAll(".stat span");
    if(stats.length >= 3 && data.stats){
      stats[0].textContent = data.stats.players;
      stats[1].textContent = data.stats.hideTime;
      stats[2].textContent = data.stats.hunterTime;
      statLabels[0].textContent = data.stats.playersLabel;
      statLabels[1].textContent = data.stats.hideTimeLabel;
      statLabels[2].textContent = data.stats.hunterTimeLabel;
    }

    // Patch / Dev info
    document.querySelectorAll(".current-version").forEach(el => el.textContent = data.version + " " + data.status);
    document.querySelectorAll(".progress-number").forEach(el => el.textContent = data.progress + "%");
    document.querySelectorAll(".progress-bar").forEach(el => el.style.width = data.progress + "%");

    const patchList = document.getElementById("dynamicPatchList");
    if(patchList && data.patchNotes){
      patchList.innerHTML = data.patchNotes.map(p => `
        <div class="patch-item">
          <b>${p.version}</b>
          ${p.changes.map(c => `${c}`).join("<br>")}
        </div>
      `).join("");
    }

    const roadmapList = document.getElementById("dynamicRoadmapList");
    if(roadmapList && data.statusItems){
      roadmapList.innerHTML = data.statusItems.map(item => `
        <div class="roadmap-item">
          <b class="${item.className}">${item.icon} ${item.title}</b>${item.description}
        </div>
      `).join("");
    }

    const blogList = document.getElementById("dynamicBlogList");
    if(blogList && data.devBlog){
      blogList.innerHTML = data.devBlog.map(b => `
        <div class="blog-item"><b>${b.title}</b>${b.text}</div>
      `).join("");
    }

    // Flow
    flow = data.flow || [];
    const flowGrid = document.getElementById('flowGrid');
    if(flowGrid){
      flowGrid.innerHTML = flow.map((f,i)=>`
        <div class="flow-card" onclick="selectFlow(${i},this)">
          <div class="num">${i+1}</div>
          <div class="thumb ${f.img}"></div>
          <h4>${f.title}</h4>
          <p>${f.text}</p>
        </div>
      `).join('');
      selectFlow(0, document.querySelector('.flow-card'));
    }
  }catch(error){
    console.error("Cannot load project.json", error);
    const flowGrid = document.getElementById('flowGrid');
    if(flowGrid){
      flowGrid.innerHTML = '<p style="color:#fca5a5">โหลด project.json ไม่สำเร็จ</p>';
    }
  }
}

loadProjectData();
