import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;

const scene = new THREE.Scene();
let animal;
let mixer;
const loader = new GLTFLoader();
loader.load(
  "/ulysses_butterfly.glb",
  function (gltf) {
    animal = gltf.scene;
    // animal.position.x = -4.5;
    // animal.position.y = -1.5;
    // animal.rotation.x = 2;
    // animal.rotation.y = -0.5;
    scene.add(animal);
    // console.log(gltf.animations);
    mixer = new THREE.AnimationMixer(animal);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove()
  },
  function (xhr) {},
  function (error) {}
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};
reRender3D();

let positionArr = [
  {
    id: "banner",
    position: { x: -4.5, y: -1.5, z: 0 },
    rotation: { x: 2, y: 0.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 2.5, y: -1, z: -5 },
    rotation: { x: 0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -3.5, y: -1, z: -5 },
    rotation: { x: 1, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -1, z: 0 },
    rotation: { x: 2, y: 0.5, z: 0 },
  },
];
const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let positionActive = positionArr.findIndex(val => val.id === currentSection)
  if(positionActive >= 0){
    let newCoordinates = positionArr[positionActive]
    // animal.position.x = newCoordinates.position.x
    // animal.position.y = newCoordinates.position.y
    // animal.position.z = newCoordinates.position.z
    gsap.to(animal.position, {
        x: newCoordinates.position.x,
        y: newCoordinates.position.y,
        z: newCoordinates.position.z,
        duration: 3,
        ease: "power1.out"
    })
    gsap.to(animal.rotation, {
        x: newCoordinates.rotation.x,
        y: newCoordinates.rotation.y,
        z: newCoordinates.rotation.z,
        duration: 3,
        ease: "power1.out"
    })
  }
};
window.addEventListener("scroll", () => {
  if (animal) {
    modelMove();
  }
});
window.addEventListener("resize", ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})
