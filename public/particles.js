let scene=new THREE.Scene();
let camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
let renderer=new THREE.WebGLRenderer({alpha:true});

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z=5;

let geo=new THREE.BufferGeometry();
let vertices=[];

for(let i=0;i<1000;i++){
 vertices.push(Math.random()*10-5);
}

geo.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));

let mat=new THREE.PointsMaterial({color:0x00ffff,size:0.05});
let mesh=new THREE.Points(geo,mat);

scene.add(mesh);

function animate(){
 requestAnimationFrame(animate);
 mesh.rotation.y+=0.001;
 renderer.render(scene,camera);
}

animate();
