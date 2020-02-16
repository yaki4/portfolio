import C from 'cannon'
import * as THREE from 'three'
// It will calculate the Y offset between each element.
const margin = 6
// And this constant is to keep the same total mass on each word. We don't want a small word to be lighter than the others.
const totalMass = 1
const force = 25
export default class Menu {
  /* eslint-disable */

  constructor (scene, world, camera) {
    
    this.camera = camera
    // DOM elements
    this.navItems = window.document.querySelectorAll(".name h1");
    // Three components
    this.scene = scene;
    this.loader = new THREE.FontLoader();
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    document.addEventListener("click", () => { this.onClick(); });
    window.addEventListener("mousemove", e => { this.onMouseMove(e); });
    // Constants
    this.words = [];
    this.world = world
    this.offset = margin * 0.5
    this.loader.load('./fonts/helvetiker_bold.typeface.json', f => {
    this.setup(f);
    });
  }
  
    setup (f) {
  
      // These options give us a more candy-ish render on the font
      const fontOption = {
        font: f,
        size: 3,
        height: 0.4,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 0.9,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 10
      };
      // FOR MY NAME
      const { innerText } = this.navItems[0]
      const words = new THREE.Group()
      // ... and parse each letter to generate a mesh
      Array.from(this.navItems).reverse().forEach(($item, i) => {
        // … 
        words.letterOff = 0;
        // on définit le sol
        words.ground = new C.Body({
          mass: 0,
          shape: new C.Box(new C.Vec3(50, 0.1, 50)),
          position: new C.Vec3(0, i * margin - this.offset, 0)
        });

        this.world.addBody(words.ground);
        Array.from(innerText).forEach((letter, j) => {
            const material = new THREE.MeshPhongMaterial({ color: 0x97df5e });
            const geometry = new THREE.TextBufferGeometry(letter, fontOption);

            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();

            const mesh = new THREE.Mesh(geometry, material);
            // Get size of our entire mesh
            mesh.size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());

            // We'll use this accumulator to get the offset of each letter. Notice that this is not perfect because each character of each font has specific kerning.
            words.letterOff += mesh.size.x;

            // Create the shape of our letter
            // Note that we need to scale down our geometry because of Box's Cannon.js class setup
            const box = new C.Box(new C.Vec3().copy(mesh.size).scale(0.5));

            // Attach the body directly to the mesh
            mesh.body = new C.Body({
                // We divide the totalmass by the length of the string to have a common weight for each words.
                mass: totalMass / innerText.length,
                position: new C.Vec3(words.letterOff, this.getOffsetY(i), 0)
            });

            // Add the shape to the body and offset it to match the center of our mesh
            const { center } = mesh.geometry.boundingSphere;
            mesh.body.addShape(box, new C.Vec3(center.x, center.y, center.z));
            // Add the body to our world
            this.world.addBody(mesh.body);
            words.add(mesh);
        });

        // Recenter each body based on the whole string.
        words.children.forEach(letter => {
            letter.body.position.x -= letter.size.x + words.letterOff * 0.5;
        });

        // Same as before
        this.words.push(words);
        console.log('ajout scene')
        this.scene.add(words);
      })
    }
    getOffsetY(i) {
      return (this.navItems.length - i - 1) * this.margin - this.offset;
    }
    update() {
      if (!this.words) return;
  
      this.words.forEach((word, j) => {
        for (let i = 0; i < word.children.length; i++) {
          const letter = word.children[i];
  
          letter.position.copy(letter.body.position);
          letter.quaternion.copy(letter.body.quaternion);
        }
      });
    }
    onMouseMove(event) {
      // We set the normalized coordinate of the mouse
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    onClick() {
      // update the picking ray with the camera and mouse position
      this.raycaster.setFromCamera(this.mouse, this.camera);
  
      // calculate objects intersecting the picking ray
      // It will return an array with intersecting objects
      const intersects = this.raycaster.intersectObjects(
          this.scene.children,
          true
      );
  
      if (intersects.length > 0) {
          const obj = intersects[0];
          const { object, face } = obj;
  
          if (!object.isMesh) return;
  
          const impulse = new THREE.Vector3()
          .copy(face.normal)
          .negate()
          .multiplyScalar(force);
  
          this.words.forEach((word, i) => {
              word.children.forEach(letter => {
                  const { body } = letter;
  
                  if (letter !== object) return;
  
                  // We apply the vector 'impulse' on the base of our body
                  body.applyLocalImpulse(impulse, new C.Vec3());
              });
          });
      }
  }
}