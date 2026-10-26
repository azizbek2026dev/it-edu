const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toast = $('#toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3000)}
const date = new Intl.DateTimeFormat('uz-UZ',{day:'numeric',month:'short',year:'numeric'}).format(new Date());
$('#todayDate').textContent = date;
const pageInfo = {
 overview:['Boshqaruv paneli','Xush kelibsiz! Bugungi IT operatsiyalari holati bilan tanishing.'],
 tickets:['IT murojaatlar','Barcha texnik so‘rovlar, ustuvorliklar va bajarilish holatini kuzating.'],
 assets:['Qurilmalar inventari','Tashkilot qurilmalari va texnik aktivlarini boshqaring.'],
 tasks:['Vazifalar','Jamoa vazifalari va kundalik rejalarning bajarilishini nazorat qiling.'],
 team:['Jamoa va xodimlar','Mas’ullar, ish yuklamasi va jamoa samaradorligini ko‘rib chiqing.'],
 reports:['Hisobotlar','IT xizmatlari, SLA va aktivlar bo‘yicha ko‘rsatkichlar.'],
 knowledge:['Bilimlar bazasi','Takrorlanuvchi muammolar va texnik yo‘riqnomalar.'],
 settings:['Sozlamalar','Ish maydoni va tizim sozlamalarini boshqaring.']
};
$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.nav-item').forEach(n=>n.classList.remove('active'));btn.classList.add('active');
  const key=btn.dataset.page, info=pageInfo[key];$('#pageTitle').innerHTML=info[0]+(key==='overview'?' <span class="wave">✦</span>':'');$('#pageSubtitle').textContent=info[1];$('#breadcrumbCurrent').textContent=info[0];
  if(key!=='overview') notify(info[0]+' bo‘limi tanlandi — demo ko‘rinish.');
  $('#sidebar').classList.remove('open');
}));
$$('[data-goto]').forEach(btn=>btn.addEventListener('click',()=>{const target=$(`[data-page="${btn.dataset.goto}"]`);if(target)target.click()}));
$('#menuToggle').addEventListener('click',()=>$('#sidebar').classList.add('open'));
$('#closeSidebar').addEventListener('click',()=>$('#sidebar').classList.remove('open'));
$('#newTicket').addEventListener('click',()=>$('#ticketDialog').showModal());
$('#ticketForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form=new FormData(e.currentTarget), subject=String(form.get('subject')||'').trim();
  if(!subject){notify('Murojaat mavzusini kiriting.');return}
  const id=1049+$$('#ticketRows tr').length-4;
  const row=document.createElement('tr');row.dataset.search=(subject+' '+form.get('department')).toLowerCase();
  const priority=String(form.get('priority'));
  const cls=priority==='Shoshilinch'?'urgent':priority==='Yuqori'?'high':priority==='Past'?'low':'medium';
  row.innerHTML=`<td><div class="ticket-title"><span class="ticket-id">#IT-${id}</span><b></b><small></small></div></td><td><span class="priority ${cls}"><i></i></span></td><td><div class="assignee"><span class="avatar avatar-purple">AR</span><span>IT Coordinator</span></div></td><td><span class="status new">Yangi</span></td>`;
  row.querySelector('.ticket-title b').textContent=subject;row.querySelector('.ticket-title small').textContent=form.get('department')+' · hozirgina';
  row.querySelector('.priority').append(document.createTextNode(' '+priority));
  $('#ticketRows').prepend(row);$('#openCount').textContent=Number($('#openCount').textContent)+1;$('#ticketShown').textContent=$$('#ticketRows tr').length;
  $('#ticketDialog').close();e.currentTarget.reset();notify('Murojaat muvaffaqiyatli yaratildi: #IT-'+id);
});
$('#ticketDialog').addEventListener('click',e=>{if(e.target===$('#ticketDialog'))$('#ticketDialog').close()});
$$('.task-row input').forEach(input=>input.addEventListener('change',()=>{
  const row=input.closest('.task-row');row.classList.toggle('done',input.checked);
  const all=$$('.task-row input'), done=all.filter(i=>i.checked).length;
  $('.task-progress span').textContent=`${done} / ${all.length} vazifa`;
  $('.task-progress .progress span').style.width=(done/all.length*100)+'%';
  notify(input.checked?'Vazifa bajarildi deb belgilandi.':'Vazifa bajarilmagan holatga qaytarildi.');
}));
$('#globalSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();let count=0;
  $$('#ticketRows tr').forEach(row=>{const match=!q||((row.innerText+' '+(row.dataset.search||'')).toLowerCase().includes(q));row.hidden=!match;if(match)count++});
  $('#ticketShown').textContent=count;
  if(q) { $$('.nav-item').forEach(n=>n.classList.remove('active'));$('#breadcrumbCurrent').textContent='Qidiruv'; }
});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus()}if(e.key==='Escape')$('#sidebar').classList.remove('open')});
$('#exportBtn').addEventListener('click',()=>{
  const rows=[['ID','Murojaat','Ustuvorlik','Masul','Holat']];
  $$('#ticketRows tr').forEach(r=>{const cells=r.querySelectorAll('td');if(cells.length)rows.push([cells[0].querySelector('.ticket-id')?.textContent||'',cells[0].querySelector('b')?.textContent||'',cells[1].innerText.trim(),cells[2].innerText.trim(),cells[3].innerText.trim()])});
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='it-murojaatlar-hisoboti.csv';a.click();URL.revokeObjectURL(url);notify('CSV hisobot yuklab olindi.');
});
$('#notifications').addEventListener('click',()=>notify('Hozircha 3 ta yangi bildirishnoma mavjud.'));
$('#quickHelp').addEventListener('click',()=>notify('Yordam: yangi murojaat yaratish yoki IT vazifalarini kuzatish bo‘limidan foydalaning.'));
$('#moreActivity').addEventListener('click',()=>notify('Barcha faolliklar bo‘limi demo rejimida.'));
