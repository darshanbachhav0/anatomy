import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { initialResource } from './startup.js';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const number = value => new Intl.NumberFormat('es').format(value);
const fileSize = value => value < 1048576 ? number(Math.max(1,Math.round(value/1024)))+' KB' : (value/1048576).toLocaleString('es',{maximumFractionDigits:1})+' MB';
const systems = [
  {id:'muscular',name:'Muscular',color:'#d69187',match:/muscul|muscles|muscle system/i},
  {id:'skeletal',name:'Esquelético',color:'#d5c8a3',match:/skelet|bones|ligament|cartilage/i},
  {id:'nervous',name:'Nervioso',color:'#e1bf72',match:/nervous|nerve|brain|cereb|spinal cord/i},
  {id:'circulatory',name:'Cardiovascular',color:'#d5717f',match:/circulat|cardiovascular|arter|vein|heart/i},
  {id:'respiratory',name:'Respiratorio',color:'#b399c8',match:/respiratory|lung|trachea|bronch/i},
  {id:'digestive',name:'Digestivo',color:'#c9a573',match:/digestive|tongue|stomach|intestin|liver/i},
  {id:'urinary',name:'Urinario',color:'#b8899c',match:/urinary|kidney|bladder|ureter/i},
  {id:'reproductive',name:'Reproductor',color:'#caa3b6',match:/reproductive|uterus|prostate|test[eis]/i},
  {id:'lymphatic',name:'Linfático',color:'#7fab83',match:/lymph|spleen|thymus/i},
  {id:'endocrine',name:'Endocrino',color:'#c3a2e4',match:/endocrine|pituitary|thyroid|adrenal/i},
  {id:'skin',name:'Tegumentario',color:'#b89e8f',match:/integumentary|skins_|skin chunk|skin system/i},
  {id:'sensory',name:'Órganos sensoriales',color:'#76bdca',match:/ear|eye|corti|cochlea|retina/i},
  {id:'other',name:'Otras estructuras',color:'#849db5',match:/$^/},
];
const systemById = Object.fromEntries(systems.map(s=>[s.id,s]));
const state = {mode:'explore',catalog:[],anatomy:{},parts:{},current:null,gltf:null,meshes:[],structures:[],selected:null,enabled:new Set(['muscular','skeletal']),hidden:new Set(),isolate:null,loadToken:0,abort:null,search:'',resultLimit:70,playing:false,loop:true,speed:1,clip:null,mixer:null,action:null,section:false,sectionFlip:1,toastTimer:null,view:'front'};
let renderer,scene,camera,controls,grid,raycaster,selectionBox,clipPlane;
let lastFrame=performance.now(),lastStatus=0,frames=0,frameTotal=0,cameraTween=null,pointerStart=null,lastEntry=null,needsRender=true;
const tempV = new THREE.Vector3();

function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>$('toast').hidden=true,3600);}
function setLoading(title,message,percent=0){$('load-overlay').hidden=false;$('load-overlay').classList.remove('error');$('retry-load').hidden=true;$('load-title').textContent=title;$('load-message').textContent=message;$('load-progress').value=percent;}
function fail(message){$('load-overlay').hidden=false;$('load-overlay').classList.add('error');$('load-title').textContent='No se pudo cargar la vista';$('load-message').textContent=message;$('retry-load').hidden=false;}
function hasVisibleParent(object){for(let node=object;node;node=node.parent)if(!node.visible)return false;return true;}
function clearSelection(){
  needsRender=true;
  if(state.selected)for(const mesh of state.selected.meshes)for(const mat of materialArray(mesh)){if(mat.emissive)mat.emissive.copy(mat.userData.originalEmissive);mat.emissiveIntensity=mat.userData.originalEmissiveIntensity;}
  state.selected=null;$('inspector-panel').scrollTop=0;if(selectionBox)selectionBox.visible=false;$('selection-label').hidden=true;
  $('inspector-content').innerHTML='<div class="empty-inspector"><div class="selection-symbol">⌖</div><h2>Explora cada detalle</h2><p>Selecciona una estructura del modelo para identificarla, aislarla y estudiarla.</p></div>';
}
function materialArray(mesh){return Array.isArray(mesh.material)?mesh.material:[mesh.material];}
function originalName(object){return object.userData.atlasName||object.userData.name||object.name||'';}
function anatomyId(object){for(let node=object;node;node=node.parent){const ids=node.userData.anatomicalIds;if(ids?.length)return String(ids[0]).replace(/^@/,'');const m=originalName(node).match(/~@?(\d{6,7})/);if(m)return m[1];}return null;}
function classify(mesh){
  let chain=[];for(let n=mesh;n;n=n.parent)chain.push(originalName(n));
  const group=chain.find(n=>/system#|system_|^muscles#|skeletal#|integumentary/i.test(n));
  const materialNames=materialArray(mesh).map(m=>m.name).join(' ');
  const target=group||materialNames||chain.join(' ');
  return systems.find(s=>s.match.test(target))?.id || systems.find(s=>s.match.test(chain.join(' ')))?.id || 'other';
}
function cleanName(name){return name.split('#')[0].replace(/_+/g,' ').replace(/\s+/g,' ').trim()||'Estructura anatómica';}
function worldBounds(meshes){
  const box=new THREE.Box3();
  for(const mesh of meshes){if(!mesh.geometry)continue;if(mesh.isSkinnedMesh){mesh.computeBoundingBox();if(mesh.boundingBox)box.union(mesh.boundingBox.clone().applyMatrix4(mesh.matrixWorld));}else{if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();if(mesh.geometry.boundingBox)box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));}}
  return box;
}
function currentBounds(){const visible=state.meshes.filter(m=>hasVisibleParent(m));const b=worldBounds(visible.length?visible:state.meshes);return b.isEmpty()?new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1)):b;}
function fit(meshes=null,view=state.view,animate=true){
  if(!state.gltf)return;
  state.gltf.scene.updateMatrixWorld(true);
  const box=meshes?worldBounds(meshes):currentBounds();if(box.isEmpty())return;
  const sphere=box.getBoundingSphere(new THREE.Sphere()),center=sphere.center;
  let direction;
  if(view==='current')direction=camera.position.clone().sub(controls.target).normalize();
  else direction=({oblique:new THREE.Vector3(-1.2,.35,-1),front:new THREE.Vector3(0,.025,-1),back:new THREE.Vector3(0,.025,1),left:new THREE.Vector3(-1,.025,0),right:new THREE.Vector3(1,.025,0),top:new THREE.Vector3(0,1,.001)})[view]||new THREE.Vector3(0,0,-1);
  const size=box.getSize(new THREE.Vector3());
  const vertical=THREE.MathUtils.degToRad(camera.fov/2),horizontal=Math.atan(Math.tan(vertical)*camera.aspect);
  direction.normalize();const referenceUp=Math.abs(direction.y)>.99?new THREE.Vector3(0,0,-1):new THREE.Vector3(0,1,0),right=new THREE.Vector3().crossVectors(referenceUp,direction).normalize(),up=new THREE.Vector3().crossVectors(direction,right).normalize();
  let distance=.03;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const offset=new THREE.Vector3(x,y,z).sub(center),depth=offset.dot(direction);distance=Math.max(distance,depth+Math.abs(offset.dot(right))/Math.tan(horizontal),depth+Math.abs(offset.dot(up))/Math.tan(vertical));}distance*=1.18;
  const target=center.clone();const position=center.clone().add(direction.normalize().multiplyScalar(distance));
  camera.near=Math.max(sphere.radius/1000,.0001);camera.far=Math.max(distance*40,100);camera.updateProjectionMatrix();
  controls.minDistance=Math.max(sphere.radius*.03,.002);controls.maxDistance=Math.max(distance*5,10);
  if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const from=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target)),to=new THREE.Spherical().setFromVector3(position.clone().sub(target));while(to.theta-from.theta>Math.PI)to.theta-=Math.PI*2;while(to.theta-from.theta<-Math.PI)to.theta+=Math.PI*2;cameraTween={from,to,start:performance.now(),fromTarget:controls.target.clone(),target};}
  else {camera.position.copy(position);controls.target.copy(target);controls.update();}
}
function initRenderer(){
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.001,1000);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.localClippingEnabled=true;
  renderer.domElement.setAttribute('aria-label','Modelo anatómico interactivo; selecciona una estructura con clic o desde la lista');renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
  $('canvas-host').append(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.autoRotateSpeed=.8;controls.screenSpacePanning=true;
  const hemi=new THREE.HemisphereLight(0xc9e7ff,0x4d3941,2.3);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffeee1,3.7);key.position.set(4,6,8);scene.add(key);
  const fill=new THREE.DirectionalLight(0xa5d5f9,2.1);fill.position.set(-5,2,-2);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xdef9ff,1.7);rim.position.set(1,3,-7);scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff,.45));
  grid=new THREE.GridHelper(12,30,0x3d687f,0x223d52);grid.visible=false;grid.material.transparent=true;grid.material.opacity=.34;scene.add(grid);
  selectionBox=new THREE.Box3Helper(new THREE.Box3(),0x79d9eb);selectionBox.visible=false;selectionBox.material.depthTest=false;selectionBox.material.transparent=true;selectionBox.material.opacity=.42;scene.add(selectionBox);
  clipPlane=new THREE.Plane(new THREE.Vector3(1,0,0),0);raycaster=new THREE.Raycaster();
  const resize=()=>{needsRender=true;const rect=$('canvas-host').getBoundingClientRect();renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/Math.max(rect.height,1);camera.updateProjectionMatrix();};new ResizeObserver(resize).observe($('canvas-host'));resize();
  controls.addEventListener('change',()=>{needsRender=true;});
  controls.addEventListener('start',()=>{cameraTween=null;});
  renderer.domElement.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY,time:performance.now()};});
  renderer.domElement.addEventListener('pointerup',e=>{if(e.button!==0||!pointerStart||Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>6||performance.now()-pointerStart.time>650)return;pick(e.clientX,e.clientY);});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('El navegador perdió el contexto 3D. Cierra otras pestañas pesadas y vuelve a cargar esta vista.');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{if(lastEntry)loadEntry(lastEntry);});
  requestAnimationFrame(frame);
}
function frame(now){
  requestAnimationFrame(frame);if(!renderer)return;
  const delta=Math.max(0,Math.min((now-lastFrame)/1000,.05));
  if(state.mixer&&state.playing){state.mixer.update(delta*state.speed);if(state.action?.paused&&!state.loop){state.playing=false;updatePlaybackButton();}}
  if(cameraTween){const t=Math.min((now-cameraTween.start)/480,1),k=1-Math.pow(1-t,3),from=cameraTween.from,to=cameraTween.to;controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.target,k);camera.position.setFromSpherical(new THREE.Spherical(THREE.MathUtils.lerp(from.radius,to.radius,k),THREE.MathUtils.lerp(from.phi,to.phi,k),THREE.MathUtils.lerp(from.theta,to.theta,k))).add(controls.target);if(t>=1)cameraTween=null;}
  controls.update();
  if(state.selected&&(needsRender||state.playing||cameraTween)){const box=worldBounds(state.selected.meshes.filter(hasVisibleParent));if(!box.isEmpty()){selectionBox.box.copy(box);selectionBox.visible=true;const center=box.getCenter(tempV);center.project(camera);const rect=$('canvas-host').getBoundingClientRect();if(center.z>-1&&center.z<1){$('selection-label').hidden=false;$('selection-label').style.left=Math.max(65,Math.min(rect.width-185,(center.x*.5+.5)*rect.width))+'px';$('selection-label').style.top=Math.max(130,Math.min(rect.height-95,(-center.y*.5+.5)*rect.height+rect.top-$('viewport').getBoundingClientRect().top))+'px';}else $('selection-label').hidden=true;}else{selectionBox.visible=false;$('selection-label').hidden=true;}}
  if(needsRender||state.playing||cameraTween||controls.autoRotate){renderer.render(scene,camera);needsRender=false;}frames++;frameTotal+=now-lastFrame;lastFrame=now;
  if(now-lastStatus>300){if(state.clip){const time=state.action?.time||0;$('timeline').value=Math.min(time/state.clip.duration*1000,1000);$('clip-time').textContent=formatTime(time)+' / '+formatTime(state.clip.duration);}
    const visibleCount=state.meshes.filter(m=>hasVisibleParent(m)).length;$('render-status').textContent=state.gltf?number(visibleCount)+(visibleCount===1?' estructura visible':' estructuras visibles'):'Visor 3D';frames=0;frameTotal=0;lastStatus=now;}
}
function formatTime(s){const seconds=Math.floor(s+.001);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
async function fetchJSON(url){const response=await fetch(url);if(!response.ok)throw new Error('No se pudo leer la biblioteca ('+response.status+').');return response.json();}
async function fetchBinary(url,signal,onProgress){
  const response=await fetch(url,{signal});if(!response.ok)throw new Error('No se encuentra un recurso del modelo ('+response.status+').');
  if(!response.body)return response.arrayBuffer();const reader=response.body.getReader(),chunks=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);total+=value.length;onProgress(value.length);}
  const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes.buffer;
}
function disposeAsset(gltf){
  if(!gltf)return;const geometries=new Set(),materials=new Set(),textures=new Set(),skeletons=new Set();gltf.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.skeleton)skeletons.add(o.skeleton);if(o.material)for(const m of materialArray(o)){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});
  for(const item of geometries)item.dispose();for(const item of materials)item.dispose();for(const item of textures){item.image?.close?.();item.dispose();}for(const item of skeletons)item.dispose();gltf.scene.removeFromParent();
}
async function loadEntry(entry){
  if(!entry)return;lastEntry=entry;const token=++state.loadToken;state.abort?.abort();state.abort=new AbortController();const signal=state.abort.signal;
  setLoading(entry.label,'Cargando geometría y texturas…');$('library-panel').classList.remove('open');$('inspector-panel').classList.remove('open');clearSelection();state.playing=false;
  try{
    let bytes=0;const progress=n=>{bytes+=n;if(token===state.loadToken){$('load-progress').value=Math.min(85,bytes/entry.bytes*85);$('load-message').textContent=(bytes/1048576).toFixed(1)+' de '+(entry.bytes/1048576).toFixed(1)+' MB · preparando la vista';}};
    let buffer;
    if(state.parts[entry.url]){const chunks=[];for(const part of state.parts[entry.url])chunks.push(new Uint8Array(await fetchBinary(part,signal,progress)));const length=chunks.reduce((s,c)=>s+c.length,0),joined=new Uint8Array(length);let offset=0;for(const c of chunks){joined.set(c,offset);offset+=c.length;}buffer=joined.buffer;}
    else buffer=await fetchBinary(entry.url,signal,progress);
    if(token!==state.loadToken)return;$('load-progress').value=87;$('load-message').textContent='Preparando materiales y estructuras…';
    const manager=new THREE.LoadingManager();let textureErrors=[];manager.onError=url=>textureErrors.push(url);const loader=new GLTFLoader(manager);
    const baseURL=new URL(entry.url,location.href);baseURL.pathname=baseURL.pathname.substring(0,baseURL.pathname.lastIndexOf('/')+1);
    const gltf=await loader.parseAsync(buffer,baseURL.href);
    if(token!==state.loadToken){disposeAsset(gltf);return;}
    if(textureErrors.length){disposeAsset(gltf);throw new Error('Faltan '+textureErrors.length+' texturas. Mantén la carpeta de recursos completa.');}
    const materialDefs=gltf.parser.json.materials||[];for(let i=0;i<materialDefs.length;i++){const material=await gltf.parser.getDependency('material',i);if((materialDefs[i].pbrMetallicRoughness?.baseColorTexture&&!material.map)||(materialDefs[i].normalTexture&&!material.normalMap)){disposeAsset(gltf);throw new Error('No se pudieron cargar todas las texturas. Vuelve a intentar.');}}
    if(token!==state.loadToken){disposeAsset(gltf);return;}
    state.mixer?.stopAllAction();if(state.mixer&&state.gltf)state.mixer.uncacheRoot(state.gltf.scene);disposeAsset(state.gltf);
    state.gltf=gltf;state.current=entry;state.mixer=null;state.clip=null;state.action=null;state.meshes=[];state.structures=[];state.hidden.clear();state.isolate=null;
    const sourceNames=new Map((gltf.parser.json.nodes||[]).filter(n=>n.extras?.unitySource).map(n=>[n.extras.unitySource.file+':'+n.extras.unitySource.gameObjectId,n.name]));
    gltf.scene.traverse(o=>{if(o.userData.unitySource)o.userData.atlasName=sourceNames.get(o.userData.unitySource.file+':'+o.userData.unitySource.gameObjectId)||o.name;});
    const structureMap=new Map();
    gltf.scene.traverse(o=>{
      if(!o.isMesh)return;state.meshes.push(o);const id=anatomyId(o);let node=o;while(node.parent&&!node.userData.unitySource&&!node.userData.anatomicalIds?.length)node=node.parent;
      const original=originalName(node)||o.name;const data=state.anatomy[id]||{};
      const system=classify(o),key=id?system+':'+id:system+':'+node.uuid;
      if(!structureMap.has(key))structureMap.set(key,{key,id,label:data.es||cleanName(original),latin:data.latin||'',description:data.description||'',english:data.en||cleanName(original),system,meshes:[],original});
      const structure=structureMap.get(key);structure.meshes.push(o);o.userData.atlasStructure=structure;
      const cloned=materialArray(o).map(m=>{const c=m.clone();c.userData={...c.userData,originalOpacity:c.opacity,originalTransparent:c.transparent,originalDepthWrite:c.depthWrite,originalEmissive:c.emissive?.clone()||new THREE.Color(),originalEmissiveIntensity:c.emissiveIntensity??1};if(c.map)c.map.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);c.clippingPlanes=state.section?[clipPlane]:[];return c;});o.material=Array.isArray(o.material)?cloned:cloned[0];
      if(o.isSkinnedMesh)o.frustumCulled=false;
    });
    state.structures=[...structureMap.values()].sort((a,b)=>a.label.localeCompare(b.label,'es'));
    state.groups=[];const leafIds=new Set(state.structures.map(s=>s.id));
    gltf.scene.traverse(node=>{const id=node.userData.anatomicalIds?.[0],data=state.anatomy[id];if(node.isMesh||!id||!data?.es||leafIds.has(id))return;const meshes=[];node.traverse(o=>{if(o.isMesh)meshes.push(o);});if(!meshes.length)return;const counts={};for(const mesh of meshes){const s=mesh.userData.atlasStructure.system;counts[s]=(counts[s]||0)+1;}const system=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];state.groups.push({key:'group:'+id,id,label:data.es,latin:data.latin||'',description:data.description||'',english:data.en||cleanName(originalName(node)),system,meshes,original:originalName(node),isGroup:true});leafIds.add(id);});
    for(const mesh of state.meshes){let names=[];for(let n=mesh;n;n=n.parent)names.push(originalName(n));const chain=names.join(' ');mesh.userData.atlasGender=/#Female|Female[_ ]Skin|female pelvic/i.test(chain)?'female':/#Male|Male[_ ]Skin|Male Hair/i.test(chain)?'male':null;}
    if(!$('sex-select')){const label=document.createElement('label');label.className='field-label';label.id='sex-label';label.htmlFor='sex-select';label.style.marginTop='15px';label.textContent='CONFIGURACIÓN ANATÓMICA';const select=document.createElement('select');select.id='sex-select';select.setAttribute('aria-label','Configuración anatómica');select.innerHTML='<option value="male">Masculina</option><option value="female">Femenina</option>';$('scene-select').after(label,select);select.onchange=()=>{state.sex=select.value;applyVisibility();};}
    state.sex=state.sex||'male';$('sex-select').value=state.sex;$('sex-select').hidden=$('sex-label').hidden=!entry.scene||!['level0','level1'].includes(entry.source);
    scene.add(gltf.scene);gltf.scene.updateMatrixWorld(true);
    const isBody=entry.scene&&['level0','level1'].includes(entry.source);
    state.enabled=isBody?new Set(['muscular','skeletal']):new Set(systems.map(s=>s.id));
    if(gltf.animations.length){state.clip=gltf.animations[0];state.mixer=new THREE.AnimationMixer(gltf.scene);state.action=state.mixer.clipAction(state.clip);state.action.setLoop(state.loop?THREE.LoopRepeat:THREE.LoopOnce,state.loop?Infinity:1);state.action.clampWhenFinished=true;state.action.play();state.mixer.setTime(0);gltf.scene.updateMatrixWorld(true);gltf.scene.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});state.playing=true;}
    $('scene-title').textContent=entry.label;$('scene-category').textContent=entry.animated?(entry.region||'MOVIMIENTO ANATÓMICO').toUpperCase():'EXPLORACIÓN ANATÓMICA';
    $('scene-subtitle').textContent=entry.animated?'Movimiento anatómico · '+state.clip.duration.toFixed(1)+' segundos':isBody?'Sistemas muscular y esquelético':number(state.structures.length)+' estructuras · vista anatómica';
    $('animation-dock').hidden=!state.clip;$('viewport').classList.toggle('has-animation',!!state.clip);$('clip-title').textContent=entry.label;updatePlaybackButton();
    applyVisibility();renderSystems();renderStructures();renderResources();
    const bounds=currentBounds(),size=bounds.getSize(new THREE.Vector3());grid.position.set(bounds.getCenter(new THREE.Vector3()).x,bounds.min.y-.015,bounds.getCenter(new THREE.Vector3()).z);grid.scale.setScalar(Math.max(size.x,size.y,size.z)/8);
    state.view=entry.animated?'oblique':'front';$('camera-view').value=state.view;$('view-name').textContent=entry.animated?'Perspectiva 3/4':'Vista anterior';fit(null,state.view,false);updateClipping();
    $('load-progress').value=97;await new Promise(resolve=>requestAnimationFrame(resolve));if(token===state.loadToken)$('load-overlay').hidden=true;
    window.dispatchEvent(new CustomEvent('atlas:loaded',{detail:{id:entry.id,meshes:state.meshes.length,animations:gltf.animations.length}}));
  }catch(error){if(error.name==='AbortError'||token!==state.loadToken)return;console.error('Atlas load failed:',error);fail(error.message||'No se pudo leer el modelo. Vuelve a intentar.');}
}
function applyVisibility(){
  needsRender=true;
  for(const mesh of state.meshes){const s=mesh.userData.atlasStructure;const gender=mesh.userData.atlasGender;const genderMatches=!state.current?.scene||!['level0','level1'].includes(state.current.source)||!gender||gender===state.sex;mesh.visible=genderMatches&&state.enabled.has(s.system)&&!state.hidden.has(s.key)&&(!state.isolate||state.isolate===s.key||state.isolateMeshes?.has(mesh.uuid));}
  if(state.selected&&!state.selected.meshes.some(hasVisibleParent)){$('selection-label').hidden=true;selectionBox.visible=false;}
  $('visible-count').textContent=number(state.structures.filter(s=>s.meshes.some(hasVisibleParent)).length);renderStructures();
}
function renderSystems(){
  $('system-list').innerHTML=systems.map(s=>{const count=state.structures.filter(row=>row.system===s.id).length;if(!count&&state.gltf)return '';return `<label class="system-row ${state.enabled.has(s.id)?'enabled':''}"><input type="checkbox" data-system="${s.id}" ${state.enabled.has(s.id)?'checked':''}><span class="system-dot" style="background:${s.color}"></span><span class="system-name">${s.name}</span><span class="system-count">${count||'—'}</span></label>`;}).join('');
  $('system-list').querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{if(input.checked)state.enabled.add(input.dataset.system);else state.enabled.delete(input.dataset.system);state.isolate=null;applyVisibility();renderSystems();}));
}
function renderStructures(){
  const query=norm($('structure-search').value);const source=query?[...(state.groups||[]),...state.structures]:state.structures;const rows=source.filter(s=>!query||norm(s.label+' '+s.latin+' '+s.english+' '+s.id).includes(query));if(!query)rows.sort((a,b)=>Number(b.meshes.some(hasVisibleParent))-Number(a.meshes.some(hasVisibleParent)));
  $('structure-list').innerHTML=rows.slice(0,120).map(s=>`<button class="structure-item ${s.meshes.some(hasVisibleParent)?'':'dim'} ${state.selected?.key===s.key?'selected':''}" data-structure="${esc(s.key)}"><span class="system-dot" style="background:${systemById[s.system].color}"></span><span>${esc(s.label)}</span><small>${s.meshes.some(hasVisibleParent)?'':'○'}</small></button>`).join('')+(rows.length>120?`<p class="no-results">${number(rows.length-120)} estructuras más. Filtra por nombre.</p>`:rows.length?'':'<p class="no-results">No se encontraron estructuras.</p>');
  $('structure-list').querySelectorAll('[data-structure]').forEach(button=>button.addEventListener('click',()=>selectStructure(source.find(s=>s.key===button.dataset.structure),{reveal:true,focus:true})));
  $('visible-count').textContent=number(state.structures.filter(s=>s.meshes.some(hasVisibleParent)).length);
}
function selectStructure(structure,{reveal=false,focus=false}={}){
  if(!structure)return;clearSelection();state.selected=structure;
  if(reveal){for(const mesh of structure.meshes){state.enabled.add(mesh.userData.atlasStructure.system);state.hidden.delete(mesh.userData.atlasStructure.key);}if(state.isolate){state.isolate=structure.key;state.isolateMeshes=new Set(structure.meshes.map(m=>m.uuid));}const genders=[...new Set(structure.meshes.map(m=>m.userData.atlasGender).filter(Boolean))];if(genders.length===1){state.sex=genders[0];if($('sex-select'))$('sex-select').value=state.sex;}applyVisibility();renderSystems();}
  for(const mesh of structure.meshes)for(const mat of materialArray(mesh)){if(mat.emissive){mat.emissive.set(0x176e87);mat.emissiveIntensity=.55;}}
  $('selection-label').textContent=structure.label;$('selection-label').hidden=false;
  $('inspector-panel').scrollTop=0;
  $('inspector-content').innerHTML=`<span class="selection-system">${systemById[structure.system].name}</span><h2 class="selection-title">${esc(structure.label)}</h2>${structure.latin?`<p class="latin-name">${esc(structure.latin)}</p>`:''}<p class="source-name">${esc(structure.english)}</p>${structure.description?`<details class="definition" open><summary>Descripción anatómica</summary><p>${esc(structure.description).replace(/\n/g,'<br>')}</p></details>`:''}<div class="selection-actions"><button id="focus-selection" class="primary-action">Encuadrar estructura</button><button id="isolate-selection">${state.isolate===structure.key?'Ver contexto':'Aislar'}</button><button id="hide-selection">Ocultar</button></div><label class="opacity-label" for="opacity"><span>Opacidad</span><span id="opacity-value">100 %</span></label><input id="opacity" type="range" min="5" max="100" value="100"><button id="restore-structures" class="text-button" style="margin-top:12px">Restaurar estructuras</button>${structure.id?`<div class="selection-id">Identificador anatómico ${esc(structure.id)}</div>`:''}`;
  $('focus-selection').onclick=()=>fit(structure.meshes.filter(hasVisibleParent),'current');
  $('isolate-selection').onclick=()=>{state.isolate=state.isolate===structure.key?null:structure.key;state.isolateMeshes=new Set(structure.meshes.map(m=>m.uuid));for(const mesh of structure.meshes)state.enabled.add(mesh.userData.atlasStructure.system);applyVisibility();renderSystems();$('isolate-selection').textContent=state.isolate?'Ver contexto':'Aislar';if(state.isolate)fit(structure.meshes.filter(hasVisibleParent),'current');};
  $('hide-selection').onclick=()=>{for(const mesh of structure.meshes)state.hidden.add(mesh.userData.atlasStructure.key);state.isolate=null;applyVisibility();clearSelection();toast('Estructura oculta. Usa Restablecer para recuperarla.');};
  $('restore-structures').onclick=()=>{state.hidden.clear();state.isolate=null;state.enabled=new Set(systems.map(s=>s.id));for(const mesh of state.meshes)for(const mat of materialArray(mesh)){mat.opacity=mat.userData.originalOpacity;mat.transparent=mat.userData.originalTransparent;mat.depthWrite=mat.userData.originalDepthWrite;mat.needsUpdate=true;}applyVisibility();renderSystems();$('opacity').value=100;$('opacity-value').textContent='100 %';};
  $('opacity').oninput=e=>{needsRender=true;const value=Number(e.target.value)/100;$('opacity-value').textContent=e.target.value+' %';for(const mesh of structure.meshes)for(const mat of materialArray(mesh)){mat.opacity=mat.userData.originalOpacity*value;mat.transparent=value<1||mat.userData.originalTransparent;mat.depthWrite=value<1?false:mat.userData.originalDepthWrite;mat.needsUpdate=true;}};
  renderStructures();if(focus)fit(structure.meshes.filter(hasVisibleParent),'current');if(innerWidth<=950)$('inspector-panel').classList.add('open');
}
function pick(x,y){
  if(!state.gltf||!$('load-overlay').hidden)return;const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1),camera);
  const hits=raycaster.intersectObjects(state.meshes.filter(hasVisibleParent),false).filter(hit=>!state.section||clipPlane.distanceToPoint(hit.point)>=0);
  if(hits.length)selectStructure(hits[0].object.userData.atlasStructure);else{clearSelection();renderStructures();}
}
function setMode(mode){
  if(!['explore','motion','library'].includes(mode))return;state.mode=mode;state.search='';state.resultLimit=70;$('search').value='';document.querySelectorAll('.nav-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  document.querySelectorAll('.nav-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  $('panel-title').textContent=({explore:'Explorar anatomía',motion:'Movimientos anatómicos',library:'Biblioteca completa'})[mode];
  $('search').placeholder=mode==='motion'?'Buscar un movimiento…':'Buscar una estructura…';
  $('explore-controls').hidden=mode!=='explore';$('motion-controls').hidden=mode!=='motion';$('library-controls').hidden=mode!=='library';renderResources();
  if(innerWidth<=680)$('library-panel').classList.add('open');
}
function filteredResources(){
  const query=norm(state.search),region=$('region-filter').value,kind=$('kind-filter').value;
  if(state.mode==='explore'&&query){return [...(state.groups||[]),...state.structures].filter(s=>norm(s.label+' '+s.latin+' '+s.english+' '+s.id).includes(query)).map(s=>({id:'structure:'+s.key,label:s.label,anatomicalStructure:s,kind:'structure',name:s.english,region:systemById[s.system].name}));}
  return state.catalog.filter(row=>{
    if(state.mode==='motion'&&(!row.animated||(region!=='all'&&row.region!==region)))return false;
    if(state.mode==='library'&&kind!=='all'&&row.kind!==kind)return false;
    if(state.mode==='explore')return false;
    const anatomical=row.anatomicalIds.map(id=>{const a=state.anatomy[id];return a?[a.es,a.en,a.latin].join(' '):id;}).join(' ');
    return !query||norm(row.label+' '+row.name+' '+(row.region||'')+' '+anatomical+' '+row.anatomicalIds.join(' ')).includes(query);
  });
}
function renderResources(){
  const rows=filteredResources();const showing=state.mode!=='explore'||!!state.search;$('results-heading').hidden=!showing;$('result-count').textContent=number(rows.length)+(rows.length===1?' RESULTADO':' RESULTADOS');$('explore-controls').hidden=state.mode!=='explore'||!!state.search;
  $('resource-list').innerHTML=rows.slice(0,state.resultLimit).map(row=>`<button class="resource-card ${state.current?.id===row.id?'selected':''}" data-resource="${esc(row.id)}"><span class="card-topline">${esc(row.region||(row.scene?'Preparación anatómica':row.kind==='marker'?'Marcador anatómico':row.kind==='model'?'Malla individual':'Conjunto anatómico'))}${row.variant?' · Variante '+row.variant:''}</span><strong>${esc(row.label)}</strong><small>${row.animated?row.animations[0].duration.toFixed(1)+' s · movimiento 3D':row.kind==='structure'?'Seleccionar en la vista':fileSize(row.bytes)+' · '+number(row.triangles)+' triángulos'}</small></button>`).join('')+(showing&&!rows.length?'<p class="no-results">No hay resultados para esta búsqueda. Prueba otro nombre o revisa los filtros.</p>':'');
  $('more-results').hidden=rows.length<=state.resultLimit;
  $('resource-list').querySelectorAll('[data-resource]').forEach(button=>button.onclick=()=>{const row=rows.find(r=>r.id===button.dataset.resource);if(row.anatomicalStructure){selectStructure(row.anatomicalStructure,{reveal:true,focus:true});$('library-panel').classList.remove('open');}else loadEntry(row);});
}
function updatePlaybackButton(){$('play-animation').textContent=state.playing?'Ⅱ':'▶';$('play-animation').setAttribute('aria-label',state.playing?'Pausar animación':'Reproducir animación');}
function togglePlay(){if(!state.action)return;state.playing=!state.playing;if(state.playing&&state.action.paused){state.action.reset().play();}updatePlaybackButton();}
function updateClipping(){
  needsRender=true;
  if(!state.gltf)return;const bounds=worldBounds(state.meshes),axis=$('section-axis').value,t=Number($('section-position').value)/100;
  const position=THREE.MathUtils.lerp(bounds.min[axis],bounds.max[axis],t),normal=new THREE.Vector3();normal[axis]=state.sectionFlip;clipPlane.set(normal,-position*state.sectionFlip);
  for(const mesh of state.meshes)for(const mat of materialArray(mesh)){mat.clippingPlanes=state.section?[clipPlane]:[];mat.clipShadows=true;mat.needsUpdate=true;}
}
function resetView(){
  clearSelection();state.hidden.clear();state.isolate=null;state.enabled=state.current?.scene&&['level0','level1'].includes(state.current.source)?new Set(['muscular','skeletal']):new Set(systems.map(s=>s.id));
  for(const mesh of state.meshes)for(const mat of materialArray(mesh)){mat.opacity=mat.userData.originalOpacity;mat.transparent=mat.userData.originalTransparent;mat.depthWrite=mat.userData.originalDepthWrite;mat.needsUpdate=true;}
  state.section=false;$('section-controls').hidden=true;$('toggle-section').classList.remove('active');$('toggle-section').setAttribute('aria-pressed','false');updateClipping();applyVisibility();renderSystems();state.view='front';$('camera-view').value='front';$('view-name').textContent='Vista anterior';fit();toast('Vista restablecida');
}
function wireUI(){
  document.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>setMode(button.dataset.mode));
  $('search').oninput=e=>{state.search=e.target.value;state.resultLimit=70;renderResources();};$('structure-search').oninput=renderStructures;
  $('region-filter').onchange=$('kind-filter').onchange=()=>{state.resultLimit=70;renderResources();};$('more-results').onclick=()=>{state.resultLimit+=70;renderResources();};
  $('scene-select').onchange=e=>loadEntry(state.catalog.find(row=>row.id===e.target.value));
  $('show-all-systems').onclick=()=>{state.enabled=new Set(systems.map(s=>s.id));state.hidden.clear();state.isolate=null;applyVisibility();renderSystems();};
  $('fit-view').onclick=()=>fit(state.selected?.meshes.filter(hasVisibleParent)||null,'current');$('reset-view').onclick=resetView;
  $('camera-view').onchange=e=>{state.view=e.target.value;$('view-name').textContent='Vista '+e.target.selectedOptions[0].textContent.toLowerCase();fit(state.selected?.meshes||null,state.view);};
  $('auto-rotate').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('auto-rotate').classList.toggle('active',controls.autoRotate);$('auto-rotate').setAttribute('aria-pressed',String(controls.autoRotate));};
  $('toggle-grid').onclick=()=>{needsRender=true;grid.visible=!grid.visible;$('toggle-grid').classList.toggle('active',grid.visible);$('toggle-grid').setAttribute('aria-pressed',String(grid.visible));};
  $('toggle-section').onclick=()=>{state.section=!state.section;$('section-controls').hidden=!state.section;$('toggle-section').classList.toggle('active',state.section);$('toggle-section').setAttribute('aria-pressed',String(state.section));updateClipping();};
  $('section-position').oninput=$('section-axis').onchange=updateClipping;$('flip-section').onclick=()=>{state.sectionFlip*=-1;updateClipping();};
  $('play-animation').onclick=togglePlay;$('playback-speed').onchange=e=>{state.speed=Number(e.target.value);};
  $('timeline').oninput=e=>{if(!state.mixer)return;const time=Math.min(Number(e.target.value)/1000*state.clip.duration,state.clip.duration-0.000001);state.action.paused=false;state.action.enabled=true;state.mixer.setTime(time);state.gltf.scene.updateMatrixWorld(true);needsRender=true;};
  $('loop-animation').onclick=()=>{state.loop=!state.loop;if(state.action)state.action.setLoop(state.loop?THREE.LoopRepeat:THREE.LoopOnce,state.loop?Infinity:1);$('loop-animation').classList.toggle('active',state.loop);$('loop-animation').setAttribute('aria-pressed',String(state.loop));};
  $('save-image').onclick=()=>{if(!state.gltf)return;renderer.render(scene,camera);const out=document.createElement('canvas');out.width=renderer.domElement.width;out.height=renderer.domElement.height;const ctx=out.getContext('2d');ctx.fillStyle='#101f30';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#d9edf7';ctx.font=Math.max(20,Math.round(out.width/65))+'px Segoe UI';ctx.fillText('ATLAS · '+state.current.label,28,out.height-28);out.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='atlas-'+state.current.label.replace(/[^\p{L}\p{N}]+/gu,'-')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Imagen guardada');},'image/png');};
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('La pantalla completa no está disponible en este navegador.');}};
  $('help-button').onclick=()=>$('help-dialog').showModal();$('help-dialog').onclick=e=>{if(e.target===$('help-dialog')){const r=$('help-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('help-dialog').close();}};
  $('open-library').onclick=()=>$('library-panel').classList.add('open');$('close-library').onclick=()=>$('library-panel').classList.remove('open');$('open-inspector').onclick=()=>$('inspector-panel').classList.add('open');$('close-inspector').onclick=()=>$('inspector-panel').classList.remove('open');
  $('retry-load').onclick=()=>{if(lastEntry)loadEntry(lastEntry);else location.reload();};
  document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)||$('help-dialog').open)return;if(e.key==='/'){e.preventDefault();$('library-panel').classList.add('open');$('search').focus();}else if(e.key.toLowerCase()==='f'){e.preventDefault();fit(state.selected?.meshes.filter(hasVisibleParent)||null,'current');}else if(e.key.toLowerCase()==='r'){resetView();}else if(e.code==='Space'&&state.clip){e.preventDefault();togglePlay();}else if(e.key==='Escape'){clearSelection();renderStructures();$('library-panel').classList.remove('open');$('inspector-panel').classList.remove('open');}});
}
function registerTools(){
  const context=document.modelContext;if(!context?.registerTool)return;const life=new AbortController();window.addEventListener('pagehide',()=>life.abort(),{once:true});
  const tools=[
    {name:'atlas_search_resources',title:'Buscar recursos anatómicos',description:'Busca modelos o movimientos en la biblioteca completa.',inputSchema:{type:'object',properties:{query:{type:'string',minLength:1},animated:{type:'boolean'}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:input=>{if(typeof input.query!=='string'||!input.query.trim())throw new Error('Introduce una búsqueda.');const q=norm(input.query);return state.catalog.filter(r=>(input.animated===undefined||r.animated===input.animated)&&norm(r.label+' '+r.name+' '+r.region).includes(q)).slice(0,30).map(r=>({id:r.id,name:r.label,animated:r.animated}));}},
    {name:'atlas_load_resource',title:'Abrir recurso anatómico',description:'Carga en el visor el modelo o movimiento indicado por su identificador del catálogo.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{const entry=state.catalog.find(r=>r.id===input.id);if(!entry)throw new Error('El recurso no existe.');await loadEntry(entry);if(state.current?.id!==entry.id||!$('load-overlay').hidden)throw new Error('No se pudo cargar el recurso.');return {id:entry.id,name:entry.label,structures:state.structures.length};}},
    {name:'atlas_select_structure',title:'Seleccionar estructura anatómica',description:'Selecciona una estructura de la vista actual y la muestra en la ficha anatómica.',inputSchema:{type:'object',properties:{anatomicalId:{type:'string'}},required:['anatomicalId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{const row=[...(state.groups||[]),...state.structures].find(s=>s.id===input.anatomicalId);if(!row)throw new Error('La estructura no está en la vista actual.');selectStructure(row,{reveal:true,focus:true});return {id:row.id,name:row.label};}},
  ];
  for(const tool of tools)try{Promise.resolve(context.registerTool(tool,{signal:life.signal})).catch(error=>console.warn('WebMCP registration unavailable',error));}catch(error){console.warn('WebMCP unavailable',error);}
}
async function start(){
  wireUI();renderSystems();$('search').setAttribute('aria-label','Buscar estructuras o movimientos');document.querySelectorAll('.nav-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode==='explore')));
  try{
    initRenderer();const [catalog,anatomy,parts,summary]=await Promise.all([fetchJSON('./data/catalog.json'),fetchJSON('./data/anatomy.json'),fetchJSON('./data/parts.json'),fetchJSON('./data/summary.json')]);state.catalog=catalog;state.anatomy=anatomy;state.parts=parts;
    const variants=new Map();for(const row of catalog){const key=row.kind+':'+row.label;if(!variants.has(key))variants.set(key,[]);variants.get(key).push(row);}for(const rows of variants.values())if(rows.length>1)rows.forEach((row,index)=>row.variant=(index+1)+'/'+rows.length);
    $('header-count').textContent=number(summary.assets)+' recursos · '+summary.animations+' movimientos';$('library-footer-text').textContent=number(summary.assets)+' recursos anatómicos disponibles';
    const scenes=catalog.filter(r=>r.scene);$('scene-select').innerHTML=scenes.map(r=>`<option value="${esc(r.id)}">${esc(r.label)}</option>`).join('');
    $('region-filter').innerHTML='<option value="all">Todas las regiones</option>'+[...new Set(catalog.filter(r=>r.animated).map(r=>r.region))].sort().map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
    const specimens=[['level3','Oído','◉'],['level4','Ojo','◉'],['level5','Piel','▦'],['level6','Lengua','◇'],['level2','Corti','◌'],['level14','Diafragma','◡']];
    $('specimen-list').innerHTML=specimens.map(([source,label,symbol])=>`<button class="specimen-button" data-scene="${source}"><span>${symbol}</span>${label}</button>`).join('');$('specimen-list').querySelectorAll('button').forEach(b=>b.onclick=()=>{const row=scenes.find(r=>r.source===b.dataset.scene);$('scene-select').value=row.id;loadEntry(row);});
    const {mode,entry:chosen}=initialResource(catalog,location.search);
    if(!chosen)throw new Error('No se encontró una preparación para esta sección.');
    $('scene-select').value=chosen.id;setMode(mode);
    window.parent.postMessage({type:'uma-study-ready'},location.origin);
    await loadEntry(chosen);registerTools();
  }catch(error){console.error('Atlas initialization failed:',error);fail(error.message.includes('WebGL')?'Este navegador no pudo iniciar el visor 3D. Activa la aceleración gráfica o utiliza otro navegador.':error.message);window.parent.postMessage({type:'uma-study-error'},location.origin);}
}
start();
