import {PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer}  from 'three';
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader"
console.log(ColladaLoader)

export function render(window: Window) {
  const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  const scene = new Scene();
  camera.position.z = 1;
  
  const geometry = new BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new MeshNormalMaterial();
  
  const mesh = new Mesh( geometry, material );
  scene.add( mesh );
  
  const renderer = new WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animation );
  document.body.appendChild( renderer.domElement );
    
  function animation(time: number ) {
  
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;
  
    renderer.render( scene, camera );
  
  }
}
