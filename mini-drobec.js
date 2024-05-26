(function(){
observerSection = new IntersectionObserver(function(entries, self){entries.forEach(entry=>{if(entry.isIntersecting){e=entry.target;a=e.tagName;if(a=='IMG'){drobec.preload(e,self)} }});},{threshold:0.1});
drobec = {

    keyimgbb:'922124d79631cd02ddd3cd21ef85ba8',
    oficial:'http://localhost:8080/min/assets/mini-drobec.js',
    cdn:'http://localhost:8080/min/assets/mini-drobec.js',

    usopro:'',
    
    time:(r) => {
        t = new Date()
        return {
            time:t.getTime(),
            hora:t.getHours(),
        }
    },
    dateFormate:(t)=>{
        return {
            time:new Date(t).getTime(),
            sm:new Date(t).toLocaleDateString('es-us', { year:"numeric", month:"numeric", day:"numeric"}),
            md:new Date(t).toLocaleDateString('es-us', { year:"numeric", month:"numeric", day:"numeric", hour:"numeric", minute:"numeric"})
        }
    },
    preload:(e,s)=>{
       if(!e.dataset.loaded){
           imag = new Image();
           imag.src = e.dataset.src;
           imag.onload =function(){e.src=this.src; if(s){s.unobserve(e)} }
           imag.onerror=function(){e.src=this.src}
       }
    },
    openImage:(f)=>{
        e = document.createElement('dialog');
        e.classList.add('wh-full','glass');
        url = (f.src||f);
        e.innerHTML = `<img src="${url}" class="wh-full fit-contain float-l padd-sm">`;
        document.body.append(e);
        e.addEventListener('click',function(){this.remove()});
        e.showModal();
    },
    wait:(f)=>{
        document.querySelectorAll('.xwait').forEach((r)=>{r.remove()});
        if(f){
            e = document.createElement('dialog');
            e.classList.add('wh-full','d-glass','xwait','d-flex','center','padd-xl','col');
            e.innerHTML = `<div class="load1"></div><h3>${f}</h3>`;
            document.body.append(e);
            e.showModal();
        }
    },
    uid:(code)=>{
        var d = new Date().getTime();
        var id = code.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return id;
    },
    confirmation: async (t,f)=>{
        drobec.wait('Load...');
        nid = drobec.uid('mdxxxxx');
        x = await new Promise((resolve) => {
            e = document.createElement('dialog');
            e.classList.add('alert','padd-md');
            e.id=nid;
            e.innerHTML = `<div class="title-3 padd-sm">${typeof(f)=='function'?'Confirma?':'Alerta!'}</div><div class="w-full body-alert padd-md">${t}</div>
            <div class="w-full padd-sm t-align-r"><button onclick="${nid}.remove()" id="bta${nid}">Aceptar</button>
            ${typeof(f)=='function'?`<button onclick="${nid}.remove()" id="btc${nid}">Cancelar</button>`:''}
            </div>`;
            document.body.append(e);
            e.showModal();
            drobec.wait();
            if(typeof(f)=='function'){
                document.getElementById('bta'+nid).addEventListener('click',function(){ resolve(true) });
                document.getElementById('btc'+nid).addEventListener('click',function(){ resolve(false) });
            }
        });
        if(typeof(f)=='function'&&x==true){f()};
    },
    fileio:async (file)=>{
        result= await drobec.fetch('https://file.io',{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({ "text":file.file,"name":(file.name||'index')+'.'+file.type, "maxDownloads": 1,"autoDelete": true }) })
        if(result.link){
            if(file.callback){file.callback(result)}else{
                drobec.confirmation(`<div class="strong fs-md">Archivo cargado</div>  autoDelete:<br>${result.expires}<br>  maxDownloads: <br>${result.maxDownloads} <input readonly class="w-full" value="${result.link}" type="url">`)
            }
        }else{
            drobec.sinConexion()
        }
    },
    downloadfile:(file)=>{
        if(file.type=='png'){
            datafile = file.file
        }else{
            dto = file.file
            datafile = URL.createObjectURL(new Blob([file.file],{type:'text/'+file.type}))
        }
        newlink = document.createElement('a');
        newlink.id='newlink';
        newlink.href = datafile
        //newlink.download = (file.name||'index')+"."+file.type
        document.body.appendChild(newlink)
        drobec.confirmation(` <div class="strong">Iniciar la descarga local</div>
            <div class="padd-md">name: ${(file.name||'index')}<br>type: ${file.type}<br>size: ${(file.file.length/1024).toFixed(2)} Kb</div>
            <div class="fs-sm padd-md br-r d-gray">Puede utilizar file.io para descargas online!</div>
            `,()=>{newlink.click();newlink.remove()})
    },
    sinConexion:()=>{
        alert('Ha ocurrido un error! verifique la conexión a Internet!')
    },
    fetch: async function(url,param,txt){
        this.wait('wait...')
        return new Promise( async (resolve) => {
            try{
                response = await fetch(url,param);
                if(txt){
                    const text = await response.text();
                    resolve(text)
                }else{
                    const text = await response.json();
                    resolve(text)
                }
            }catch(e){
                resolve({drobec:e.message})
            }            
            this.wait()
        })
    },
    viewimg:true,
    submitImgbb:(urlload,callback)=>{
        if(urlload.indexOf(';base64,')!=-1){
            up = urlload.split(',')[1]
            size='Desde un archivo de '+(urlload.length/1024).toFixed(0)+' Kb'
        }else{
            up = urlload
            size='Desde la URL de Internet'
        }
        drobec.confirmation(`<div class="w-full padd-md"><label class="switch"><input onchange="drobec.viewimg=this.checked" ${drobec.viewimg?'checked':''} type="checkbox"><div></div></label> Visualización de la imagen!</div>${drobec.viewimg?`<img onclick="drobec.openImage(this)" src="${urlload}" class="padd-sm captura fit-contain" alt="">`:''} Subir imagen a su cuenta de imgbb.com? ${size}`,async function(){
            result = await drobec.fetch('https://api.imgbb.com/1/upload',{method: 'POST',mode:'cors',headers: {'Accept': 'application/json','Content-Type': 'application/x-www-form-urlencoded'},body:"key="+drobec.keyimgbb+"&image="+encodeURIComponent(up) +"&name=img"})
                if(result.data&&result.data.url ){
                    if(callback){callback(result.data.url)}else{
                        d = result.data.url
                        drobec.confirmation(`<input class="w-full" disabled value="${d}"><img src="${d}" class="captura fit-contain" alt="">`)
                    }
                }else{
                    drobec.confirmation(`Error al subir la imagen a imgbb.com. Revise su apiKey y la conexión a Internet!<div class="fs-sm padd-sm br-r d-auto"><pre>${JSON.stringify(result,null,2)}</pre></div>`)
                }
        })
    },
    uploadImage: async(f,callback)=>{
        if(f&&f.tagName=='INPUT'){
            drobec.wait('Load...')
            file = f.files[0]
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async function(){
                urlload = await drobec.comprime(reader.result)
                drobec.wait()
                drobec.submitImgbb(urlload,callback)
            };
            reader.onerror = function(error){drobec.wait();alert(error)};
        }else{
            fileLoad = document.createElement('input')
            fileLoad.className='hidde';
            fileLoad.id='fileup';
            fileLoad.type="file"
            fileLoad.accept="image/*"
            fileLoad.addEventListener('change',function(evt){ drobec.uploadImage(this,callback) })
            document.body.append(fileLoad)
            fileLoad.click()
            fileLoad.remove()
        }
    },
	  comprime: (imgOrg)=>{
	      return new Promise((resolve, reject) => {
	      drobec.wait('Zip..')
	      console.log('Original '+imgOrg.length/1024)
	      const canvas = document.createElement("canvas");
	      const imagen = new Image();
	      imagen.onload = () => {
	          escala = (imagen.width/550).toFixed(0)||2;
	          console.log('scala' +escala)
	          if(escala==0){escala=1}
	          w=imagen.width/escala;
	          h=imagen.height/escala
	          canvas.width = w;
	          canvas.height = h;
	          canvas.getContext("2d").drawImage(imagen,0,0, w,h);
	          nf = canvas.toDataURL("image/png",20);
	          rs = imgOrg
	          if(imgOrg.length<nf.length){}else{rs=nf}
	          drobec.wait()
	          console.log('zip '+rs.length/1024)
	          resolve(rs)
	      };
	      imagen.onerror=()=>{resolve('')}
	      imagen.src = imgOrg;
	      });
  	  },
  	  bn:()=>{
        bn=document.createElement('a');
        bn.href = drobec.oficial;
        bn.innerHTML = ' &#77;ake &#119;ith &#68;robec';
        bn.className = 'absolute b-shadow bi-cup-hot-fill br-r bn fs-sm padd-sm d-glass bottom';
        if(bdy.classList.contains('acb')){bdy.append(bn)}
  	  },
    html2canvas:(s)=>{
        drobec.wait(s.wait||'Screenshoot')
        elm = document.createElement('div')
        elm.append((s.elm).cloneNode(true))
        document.body.append(elm)
        formato = {backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--bg-primary")||'#fff',removeContainer:true,allowTaint: false,useCORS:true,windowWidth:s.width||400,scale:s.scale||1}
        return new Promise((resolve) => {
            try{
            html2canvas(elm,formato).then( (canvas) => {
                img_result = canvas.toDataURL("image/png")
                console.log((img_result.length/1024).toFixed(2))
                elm.remove()
                resolve(img_result)
                drobec.wait()
            });
            }catch(e){
                elm.remove()
                resolve('fotodf')
                alert(e.message)
                drobec.wait()
            }
        })
    },
    css:`
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');
@import url('https://fonts.googleapis.com/css2?family=Alef&family=Quicksand:wght@300;400;500;600&family=Lato:wght@400;900&family=Roboto+Condensed:ital@0;1&family=Roboto+Slab&display=swap');
:root{
    --bg-primary:#f6f8fa;
    --cl-primary:#364f6b;
    --color:#ffffff;
    --resaltado:#222;
    --border:#d8e0e9;
    --footer:#001111;

    --img-gale:33.333%;
    --d-load:#fff;
    --b-img:brightness(1);
}
.theme-dark{
    --bg-primary:#001111;
    --cl-primary:#dcdcdc;
    --color:#062e44;
    --resaltado: #e6621f;
    --border:#042733;
    --footer:#000;

    --b-img:brightness(.7);
}
 /*  031722 */

*{outline:0;margin:0;padding:0;scroll-behavior:smooth;box-sizing:border-box;user-select:none;line-height:1.5em}
.w-full, .wh-full, html,body, .footer, .card-1 img, .captura {width:100%}
.h-full, .wh-full, html,body {height:100%}
.d-auto, .d-flex, .details, .body-alert{overflow:auto}
.d-hidden,.card-1, p, .n-wrap, .captura {overflow:hidden}

.d-copy {user-select:auto}

.box {padding-bottom:.8rem !important}
.drobec {min-height:1.5rem}
.drobec, details {width:100%;max-width:100%;margin:.2rem auto .3rem !importan;padding:.3rem}
.d-gale {flex-wrap:wrap}
.d-gale>img {margin:.1rem !important;width:calc( var(--img-gale) - .2rem );padding:1px;aspect-ratio:1/1}
.d-gale>img.static {aspect-ratio:auto;width:100% !important;max-width:99% !important}
.d-flex>img.drobec {height:55vh;max-height:45rem;width:auto;margin:.0rem .2rem .8rem !important;padding:1px}
.d-flex>.card-1{margin:.2rem !important}
img.drobec {display:block}


.fit-contain{object-fit:contain}
.fit-cover, .d-gale>img, .card-1 img {object-fit:cover}
img{filter:var(--b-img)}

.ellipsis, .n-wrap, p{text-overflow:ellipsis}
.n-wrap, button, .nwrap {white-space:nowrap}

.padd-sm, mark, button {padding:.18rem}
.padd-md, summary, input[type],.card-df {padding:.3rem}
.padd-lg {padding:.8rem}
.padd-xl {padding:1.4rem}

.br-n, dialog {border:none}
.br-r,.card-1, details.faq, input[type], dialog.alert, mark, .d-flex>img.drobec {border-radius:.25rem;}
.br-s, .card-1, details.faq2, details.faq, button, input[type], .switch, .switch div, dialog.alert, .d-flex>img.drobec {border:1px solid var(--border)}
.br-bs, details.default {border-bottom:1px solid #d8e0e9}


.float-l{float:left}
.float-r{float:right}
.float-n{float:none}
.t-align-c, .switch div {text-align:center}
.t-align-r {text-align:right}

.w-sm, .drobec, details, p.cite {width:600px}
.w-sm, details, p.cite, .drobec, .d-gale {max-width:96% !important;margin:auto}
.w-md {width:700px}
.w-lg {width:850px}
.w-xl, .box.d-flex {width:1290px;max-width:100% !important}

.d-flex>.d-gale{width:100% !important}

.title-1, .fs-xl {font-size:1.8rem}
.title-2, .fs-lg {font-size:1.3rem}
.title-3, .fs-md {font-size:1.1rem}
.title-4, .fs-sm {font-size:.8rem}
.title-5, .fs-xs {font-size:.6rem}
.title-1, .title-2,.title-3,.title-4, .switch, .strong{font-weight:900;color:var(--resaltado)}

.d-flex, .d-gale,.footer {display:flex;align-content:strech}
.d-flex.col {flex-direction:column}
.d-flex.center,.footer {align-items:center;justify-content:center}

details.faq2 {padding:0 !important}
.d-glass {color:#fff}
.d-glass, details.faq2 summary {background:rgba(0,0,0,0.2)}
.glass {background:rgba(0,0,0,0.0)}
.d-blur,.glass,.d-glass {backdrop-filter:blur(10px)}
.b-shadow, dialog.alert, details[open].faq {box-shadow: 0px 0px 6px #000;}
button {box-shadow:0 0 1px #333}
.d-oscurecer {filter:brightness(0.5)}
.d-gradient,button {background-image:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.0),rgba(0,0,0,0.2),rgba(0,0,0,0.4)) !important}

.btn-float {position:absolute;bottom:.5rem;right:.5rem}
button {background:#dcdcdc;margin:0 .1rem;border-radius:.2rem;text-shadow:0 0 10px #fff;color:#000;box-shadow: 0 0 2px #000 !important}
button, input{vertical-align:middle}

.sticky {position:sticky}
.absolute {position:absolute}
.top {top:0}
.top, .bottom {left:0}
.bottom {bottom:0}

.d-flex>.card-1{min-width:285px}
.card-1{width:400px;max-width:96% !important}
.card-1 img{aspect-ratio:16/12}
div.drobec.footer{min-width:100% !important;background:var(--footer);margin:0 !important;color:#fcfcfc}
.footer .title-2 {color:yellow}

details[open].faq, details.faq2, .card-df {background:var(--color)}
summary {font-weight: 400;list-style:none}
details[open] summary {font-weight:900}
details.faq>p, p.cite {margin-bottom:.7rem;border-left: 4px solid #364f6b;padding: .51rem !important;background:var(--bg-primary)}
details.faq>p {width:calc( 100% - 2rem) !important;margin:.5rem .5rem !important}
details *{visibility:hidden}
details[open] *,details summary {visibility:visible}

.switch {display:inline-block;background:var(--gray,#f9f9fd);width:38px;height:24px;border-radius:39px;vertical-align:middle;box-shadow:inset 0 0 2px #444}
.switch input, .hidden {display:none}
.switch div::before {content:"Off"}
.switch div {font-size:10px;color:#000;width:70%;height:100%;background:var(--gray,#dcdcdc);border-radius:30px;box-shadow:0 0 2px}
.switch input:checked~div::before {content:"On"}
.switch input:checked~div {float:right;background:var(--blue,dodgerblue);color:#fff;box-shadow:0 0 5px #000}

.captura{background:var(--bg-primary);color:var(--cl-primary);height:10rem;position:relative;font-size:.8em}

dialog.alert {margin:auto;width:90%;max-width:25rem}
dialog {max-width:100%;max-height:100%}
dialog.alert {animation: modal .2s;}
@keyframes modal {0%{width:0}100%{width:80%}}

.load1,.load2 {position:relative}.load1{width:48px;margin:auto;height:48px}.load1:before{content:'';width:48px;height:5px;background:#333;position:absolute;top:60px;left:0;border-radius:50%;animation:.5s linear infinite sh36}.load1:after,.load2::before{position:absolute;background:var(--d-load);top:0;left:0;height:100%}.load1:after{content:'';width:100%;border-radius:14px;animation:.5s linear infinite boxc}@keyframes boxc{15%{border-bottom-right-radius:3px}25%{transform:translateY(9px) rotate(22.5deg)}50%{transform:translateY(18px) scale(1,.9) rotate(45deg);border-bottom-right-radius:40px}75%{transform:translateY(9px) rotate(67.5deg)}100%{transform:translateY(0) rotate(90deg)}}@keyframes sh36{0%,100%{transform:scale(1,1)}50%{transform:scale(1.2,1)}}.load2{display:block;overflow:hidden;width:160px;height:10px;border-radius:30px;background-color:rgba(0,0,0,.2)}.load2::before{content:"";width:0%;border-radius:30px;animation:1s ease-in-out infinite mv0v}@keyframes mv0v{50%{width:100%}100%{width:0;right:0;left:unset}}

.bn.absolute{left:auto;right:.5rem;bottom:.5rem}

.lato,body {font-family:'lato'}
.Quicksand, .card-1, p.cite,details.faq>p {font-family:'Quicksand'}

.body-alert{max-height:25rem}

dialog.alert{color:#364f6b !important}
dialog.alert .strong,dialog.alert .title-3{color:#000}
.theme, body {background:var(--bg-primary) !important;color:var(--cl-primary) !important}
body{font-size:11pt !important}

@media(max-width:700px){
    .only-pc {display:none}
}
@media(max-width:500px){
    .footer{flex-direction:column}
}
    `,
    drobec:()=>{
        drobec_css = document.createElement('style');
        drobec_css.innerHTML = drobec.css;
        document.head.append(drobec_css);
        if(drobec.time().hora>17||drobec.time().hora<7){document.documentElement.classList.toggle('theme-dark')};
        try{drobec.wait('cargando...')}catch(e){}
        window.addEventListener('load',()=>{
            bdy = document.body;
            window.alert = drobec.confirmation;
            drobec.wait();
            document.querySelectorAll("img").forEach((f)=>{
                if(!f.dataset.aplicateLoad){
                    if(f.dataset.src){f.dataset.aplicateLoad=true;observerSection.observe(f)};
                    if(f.classList.contains('open')){f.addEventListener('click',function(){drobec.openImage(this)})};
                };
            });
            drobec.bn();
        })
    },
};
drobec.drobec()
})()
