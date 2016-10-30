import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'panorama-equirectangular',
  templateUrl: './panorama-equirectangular.component.html',
  styleUrls: ['./panorama-equirectangular.component.css']
})
export class PanoramaEquirectangularComponent implements AfterViewInit {
  /* STAGE PROPERTIES */

  private camera: THREE.PerspectiveCamera;

  private cameraTarget: THREE.Vector3;

  private scene: THREE.Scene;

  @Input()
  public fieldOfView: number = 75;

  @Input('nearClipping')
  public nearClippingPane: number = 1;

  @Input('farClipping')
  public farClippingPane: number = 1100;



  /* PANORAMA PROPERTIES */
  
  private material: THREE.MeshBasicMaterial;

  @Input()
  public widthSegments: number = 60;

  @Input()
  public heightSegments: number = 40;

  @Input()
  public radius: number = 500;

  @Input()
  public texture: string = '/assets/textures/2294472375_24a3b8ef46_o.jpg';



  /* RENDERING PROPERTIES */

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;


  /* USER INTERACTION PROPERTIES */

  private isUserInteracting: boolean = false;

  private latitude: number = 0;

  private longitude: number = 0;

  private onPointerDownPointerX: number = 0;

  private onPointerDownPointerY: number = 0;

  private onPointerDownLongitude: number = 0;
  
  private onPointerDownLatitude: number = 0;

  private phi: number = 0;

  private theta: number = 0;


  /* DEPENDENCY INJECTION (CONSTRUCTOR) */
  constructor() { }



  /* STAGING, ANIMATION, AND RENDERING */

  /**
   * Create the scene.
   */
  private createScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * Create the camera.
   */
  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
  }

  private createPanorama() {
    let geometry = new THREE.SphereGeometry(
      this.radius,
      this.widthSegments,
      this.heightSegments
    );
    geometry.scale(-1, 1, 1);

    let map = new THREE.TextureLoader()
      .load(this.texture);
    this.material = new THREE.MeshBasicMaterial({ map });
    let mesh = new THREE.Mesh(geometry, this.material);
    
    this.scene.add(mesh);
  }

  /**
   * Get aspect ratio of the view.
   */
  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;

    if (height === 0) {
      return 0;
    }

    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Rotate the camera.
   */
  private rotateCamera() {
    if (this.isUserInteracting === false) {
      this.longitude += 0.1;
    }

    this.latitude = Math.max(-85, Math.min(85, this.latitude));
    this.phi = THREE.Math.degToRad(90 - this.latitude);
    this.theta = THREE.Math.degToRad(this.longitude);

    this.cameraTarget.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
    this.cameraTarget.y = 500 * Math.cos(this.phi);
    this.cameraTarget.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.cameraTarget);
  }

  /**
   * Start the rendering loop.
   */
  private startRendering() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: PanoramaEquirectangularComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.rotateCamera();
      component.renderer.render(component.scene, component.camera);
    }());
  }



  /* EVENTS */

  public onDragEnter(event: DragEvent) {
    this.canvas.style.opacity = 0.5.toString();
  }

  public onDragLeave(event: DragEvent) {
    this.canvas.style.opacity = 1.0.toString();
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();

    let component: PanoramaEquirectangularComponent = this;
    let reader = new FileReader();
    reader.addEventListener('load', function onDroppedFileLoad() {
      component.material.map.image.src = reader.result;
      component.material.map.needsUpdate = true;
    });
    reader.readAsDataURL(event.dataTransfer.files[0]);

    this.canvas.style.opacity = 1.0.toString();
  }  

  public onMouseDown(event: MouseEvent) {
    event.preventDefault();

    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLatitude = this.latitude;
    this.onPointerDownLongitude = this.longitude;
  }

  public onMouseMove(event: MouseEvent) {
    if (this.isUserInteracting !== true) {
      // Propagate event
      return true;
    }

    this.latitude = (event.clientY - this.onPointerDownPointerY) * 0.1 +
      this.onPointerDownLatitude;
    this.longitude = (this.onPointerDownPointerX - event.clientX) * 0.1 +
      this.onPointerDownLongitude;
  }

  public onMouseUp(event: MouseEvent) {
    this.isUserInteracting = false;
  }

  public onWheel(event: MouseWheelEvent) {
    this.camera.fov += event.deltaY * 0.05;
    this.camera.updateProjectionMatrix();
  }

  public onResize(event: Event) {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }





  /* LIFECYCLE */

  ngAfterViewInit() {
    this.createScene();
    this.createCamera();
    this.createPanorama();
    this.startRendering();
  }
}
