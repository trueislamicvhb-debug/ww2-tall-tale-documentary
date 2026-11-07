// World War II educational documentary — Tall Tale 3D visual language.
// People are 2D illustrated cut-outs; every environment and prop is built in 3D.
import * as THREE from 'three';
import { W, H, ctx, clamp, lerp, bigText } from './core/lib.js';
import { L, T } from './core/timing.js';
import { camera } from './core/engine.js';
import { Toon } from './core/toon.js';

const V = (x,y,z) => new THREE.Vector3(x,y,z);
const mat = (color, roughness=0.9) => new THREE.MeshStandardMaterial({color, roughness});
const box = (scene, w,h,d, color, x,y,z, rot=0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(color));
  m.position.set(x,y,z); m.rotation.y=rot; m.castShadow=true; m.receiveShadow=true; scene.add(m); return m;
};
const cyl = (scene, r1,r2,h,color,x,y,z, rot=0, sides=16) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,sides),mat(color));
  m.position.set(x,y,z); m.rotation.z=rot; m.castShadow=true; m.receiveShadow=true; scene.add(m); return m;
};
const plane = (scene,w,h,color,x,y,z,rx=0) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat(color));
  m.position.set(x,y,z); m.rotation.x=rx; m.receiveShadow=true; scene.add(m); return m;
};
const sphere = (scene,r,color,x,y,z,sx=1,sy=1,sz=1) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r,18,12),mat(color));
  m.position.set(x,y,z); m.scale.set(sx,sy,sz); m.castShadow=true; scene.add(m); return m;
};
const toon = (look, x, z, height=1.8) => {
  const p = new Toon(look,{height,res:1.25});
  p.at(x,0,z); return p;
};
const looks = [
  {body:'#547A9B',pattern:'vest',patCol:'#D6D0B8',hat:'boater',hatCol:'#3E5268',neck:'tie',neckCol:'#A43B35'},
  {body:'#647B54',pattern:'overalls',patCol:'#3B4D3C',hat:'cap',hatCol:'#45533D'},
  {body:'#C58B62',pattern:'apron',patCol:'#E9DCC8',hat:'bun',hatCol:'#5C3929',extra:['glasses']},
  {body:'#A94A42',pattern:'vest',patCol:'#4D5364',hat:'cap',hatCol:'#3D4657'},
  {body:'#657D9B',pattern:'overalls',patCol:'#465B79',hat:'beanie',hatCol:'#3D4B62'},
  {body:'#D2A65B',pattern:'vest',patCol:'#475C77',hat:'cap',hatCol:'#475C77'},
  {body:'#B9B0A0',pattern:'apron',patCol:'#66745A',hat:'none'},
  {body:'#6E8B68',pattern:'overalls',patCol:'#475B43',hat:'cap',hatCol:'#59664C'},
  {body:'#C0A078',pattern:'vest',patCol:'#536C85',hat:'cap',hatCol:'#536C85'},
  {body:'#4C8190',pattern:'vest',patCol:'#E5D8B8',hat:'none',extra:['glasses']}
];
const titles = [
  '1939 — A WORLD ON THE EDGE','1939 — THE INVASION OF POLAND','1940 — EUROPE UNDER OCCUPATION',
  '1940 — THE BATTLE OF BRITAIN','1941 — THE EASTERN FRONT','1941 — PEARL HARBOR',
  '1942–43 — THE TURNING POINTS','1944 — D-DAY AND THE ROAD TO BERLIN',
  '1945 — THE PACIFIC WAR ENDS','1945 — A CHANGED WORLD'
];
const palettes = [
  ['#B9D4E5','#91A7B5','#D9C6A3'], ['#C3D7E6','#A9A89A','#C6B99F'],
  ['#AFC5D2','#8C969A','#AFA28F'], ['#9EC7DF','#788F9B','#C5BBA7'],
  ['#C7D7E2','#E1E5E6','#B9C4C7'], ['#8CB8D0','#4F7088','#A7A18E'],
  ['#D5C4A0','#C6A06C','#B2A17E'], ['#A8C8D9','#B6A68D','#C6B79D'],
  ['#8CB4C8','#54778A','#B8A58C'], ['#BDD6DE','#B7B6A8','#C8C1B0']
];

function buildChapter(index, E) {
  const [sky, ground, stone] = palettes[index];
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(sky);
  scene.fog = new THREE.Fog(sky, 32, 90);
  scene.add(new THREE.HemisphereLight('#F5F5F0','#66717B',1.65));
  const sun = new THREE.DirectionalLight('#FFF0D5',2.4);
  sun.position.set(-7,14,9); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-24,right:24,top:18,bottom:-18,near:0.1,far:60});
  scene.add(sun);
  plane(scene,100,100,ground,0,-0.12,0,-Math.PI/2);
  // distant low-poly hills and clouds
  for(let i=0;i<7;i++){
    sphere(scene,2.8+i%3*0.7,index===4?'#D9E1E4':'#8CA7A1',-22+i*7,1.1,-24,1.8,0.7,1.1);
  }
  // buildings / industrial silhouettes
  const cityCount = index===3 || index===9 ? 8 : 5;
  for(let i=0;i<cityCount;i++){
    const x=-18+i*5.2, h=3.5+(i%3)*1.7;
    box(scene,3.8,h,3.2,index===4?'#B9C4CA':stone,x,h/2-0.1,-11-(i%2)*2);
    for(let r=0;r<Math.floor(h/1.1);r++) for(let c=0;c<2;c++)
      box(scene,0.42,0.5,0.05,'#E7D9B5',x-0.8+c*1.5,0.9+r*1.05,-9.35-(i%2)*2);
  }
  // chapter-specific large props
  if(index===0 || index===1 || index===2 || index===9){
    // European streets, rail lines, and reconstruction cranes
    for(let z=-8;z<15;z+=3) box(scene,0.18,0.06,2.4,'#3F4549',-8,0.03,z);
    if(index===9){
      cyl(scene,0.14,0.14,10,'#7C6C57',9,5,-8);
      box(scene,0.16,0.16,14,'#7C6C57',9,10,-8);
      box(scene,0.13,0.13,5,'#7C6C57',3,8,-8,-0.25);
    }
    if(index===1){
      box(scene,5,0.18,0.45,'#5C5550',-2,0.12,2);
      for(let z=-4;z<14;z+=2) box(scene,0.12,0.15,0.18,'#554C45',-4,0.15,z);
    }
    if(index===2){
      box(scene,2.5,1.5,0.25,'#7A6250',4,0.8,1);
      box(scene,0.18,1.7,0.25,'#4F4A43',3,0.85,1);
    }
  }
  if(index===3 || index===5 || index===7 || index===8){
    // aircraft: fuselage, wings and tail; intentionally simplified and non-violent
    const aircraft=(x,y,z,color)=>{
      cyl(scene,0.34,0.34,5,color,x,y,z,Math.PI/2,14);
      box(scene,4.2,0.12,1.0,color,x,y,z);
      box(scene,1.2,0.1,0.8,color,x,y,z-1.8);
      box(scene,0.15,0.8,0.7,color,x,y+0.35,z-2.0);
    };
    aircraft(-4,6,-1,'#596C72');
    if(index===5 || index===8) {
      box(scene,15,0.7,4,'#465B68',4,0.6,5);
      box(scene,15,0.22,4,'#8E9694',4,1.05,5);
      for(let i=0;i<5;i++) box(scene,1.2,0.16,0.35,'#D5D0C2',-2+i*3,1.22,4.4);
    }
    if(index===7){
      box(scene,7,0.8,2.2,'#6B7778',7,0.55,6);
      for(let i=0;i<4;i++) sphere(scene,0.8,'#D5C9B1',-12+i*7,0.65,9,1.4,0.7,1);
    }
  }
  if(index===4 || index===6 || index===7){
    // tracked vehicle / tank silhouettes (no firing or impact animation)
    box(scene,4.1,0.7,2.2,'#596B52',-2,0.8,4);
    box(scene,2.0,0.55,1.2,'#6D805F',-2,1.35,4);
    cyl(scene,0.12,0.12,3.4,'#485646',-0.2,1.55,4,Math.PI/2,10);
    for(let x=-3.4;x<=-0.6;x+=0.7) cyl(scene,0.38,0.38,0.25,'#303A35',x,0.4,4,Math.PI/2,12);
  }
  if(index===6){
    // strategy map board
    box(scene,8,0.22,5,'#5A4C3E',8,2.2,-1);
    box(scene,7.7,0.08,4.7,'#D8C9A7',8,2.36,-1);
    for(let i=0;i<5;i++) cyl(scene,0.13,0.13,0.12,i%2?'#A53E37':'#3E6382',5+i*1.2,2.52,-2+i%2*2,0,12);
  }
  if(index===5 || index===8){
    // ocean foreground
    plane(scene,100,35,'#477F9B',0,0.03,15,-Math.PI/2);
    for(let i=0;i<7;i++) box(scene,2.2,0.12,0.08,'#B7D2D8',-18+i*6,0.12,9+i%3*2);
  }
  if(index===9){
    box(scene,7,5,2,'#D9D7C9',10,2.5,-8);
    for(let i=0;i<5;i++) box(scene,0.9,2.2,0.08,'#6B8791',7+i*1.35,1.3,-6.94);
  }
  const cast = [
    toon(looks[index],-3,2),
    toon(looks[(index+1)%10],0,3),
    toon(looks[(index+2)%10],3,2)
  ];
  cast.forEach(p=>scene.add(p.group));
  return {scene,cast};
}

export function buildShots(E) {
  const S=[], CUES=[];
  const chapters=chaptersData(E);
  const cam=camera(37);
  const add=(o)=>S.push(o);
  for(let i=0;i<T.lines.length;i++){
    const chapter=Math.min(9,Math.floor(i/7));
    const start=L(i);
    add({
      id:`WW2-${String(i+1).padStart(2,'0')}`,
      at:start,
      note:`${titles[chapter]} — narration line ${i+1}`,
      draw(lt,d,t,blit){
        const {scene,cast}=chapters[chapter];
        const k=clamp(d>0?lt/d:0);
        const sweep=Math.sin(k*Math.PI);
        cam.position.set(0.4+Math.sin(k*1.2)*1.6,4.5+0.45*sweep,14.5-k*1.4);
        cam.lookAt(Math.sin(k*0.9)*0.9,1.45,0);
        cast.forEach((p,j)=>{
          p.face(cam);
          p.set({
            mood: j===0 ? (k>0.72?'worried':'neutral') : (j===1?'happy':'neutral'),
            talk: j===1 ? 0.25+0.75*Math.abs(Math.sin(t*9.5+j)) : 0,
            blink: (Math.floor(t*1.2+j*1.7)%5===0)?1:0,
            legs: (i%3===0 && j===2)?'walk':'stand',
            phase:t*3+j
          });
          p.group.position.x=[-3+0.25*Math.sin(t*1.4),0,3+0.22*Math.cos(t*1.2)][j];
        });
        E.render(scene,cam,{bloom:0.12,aperture:0.0005,maxblur:0.004,focus:13,t});
        blit();
        ctx.save();
        ctx.fillStyle='rgba(12,22,30,0.72)';
        ctx.fillRect(42,34,690,76);
        bigText(titles[chapter],387,72,25,'#FFF4D5');
        ctx.restore();
      }
    });
    if(i%6===0) CUES.push({t:+start.toFixed(3),type:'whoosh',gain:0.55});
  }
  return {shots:S,cues:CUES};
}
function chaptersData(E){ return Array.from({length:10},(_,i)=>buildChapter(i,E)); }
