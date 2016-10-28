import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'geometry-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {
  /* HELPER PROPERTIES (PRIVATE PROPERTIES) */
  private camera: THREE.PerspectiveCamera;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  
  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private cube: THREE.Mesh;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;



  /* DEPENDENCY INJECTION (CONSTRUCTOR) */
  constructor() { }



  /* STAGING, ANIMATION, AND RENDERING */

  /**
   * Animate the cube
   */
  private animateCube() {
    // TODO: Convert rotation parameters to Inputs
    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.01;
  }

  /**
   * Create the cube
   */
  private createCube() {
    // TODO: Convert texture path to Input
    let texture = new THREE.TextureLoader()
      .load('../../assets/textures/crate.gif');
    let material = new THREE.MeshBasicMaterial({ map: texture });
    
    // TODO: Convert parameters to Inputs
    let geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    this.cube = new THREE.Mesh(geometry, material);

    // Add cube to scene
    this.scene.add(this.cube);
  }

  /**
   * Create the scene
   */
  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    // TODO: Convert parameters to Inputs
    let fieldOfView = 70;
    let aspectRatio = this.getAspectRatio();
    let nearClippingPane = 1;
    let farClippingPane = 1000;
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearClippingPane,
      farClippingPane
    );
    // Move camera to coordinates (0,0,400)
    this.camera.position.z = 400;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   */
  private startRenderingLoop() {
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }



  /* EVENTS */

  /**
   * Update scene after resizing. 
   */
  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }



  /* LIFECYCLE */

  /**
   * We need to wait until template is bound to DOM, as we need the view
   * dimensions to create the scene. We could create the cube in a Init hook,
   * but we would be unable to add it to the scene until now.
   */
  public ngAfterViewInit() {
    this.createScene();
    this.createCube();
    this.startRenderingLoop();
  }
}
