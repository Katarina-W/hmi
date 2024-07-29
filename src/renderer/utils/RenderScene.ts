import { message } from "antd";
import { MessageType } from "antd/es/message/interface";
import EventEmitter from "eventemitter3";
import { debounce } from "lodash-es";
import {
  AmbientLight,
  AnimationMixer,
  DefaultLoadingManager,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/examples/jsm/misc/Timer.js";

import type { ALL_RENDER_EVENT } from "../typings";
import Stats from "./libs/Stats";

// 监听3d场景绘制进度
let hideThreeLoading: MessageType | null;
DefaultLoadingManager.onStart = () => {
  if (!hideThreeLoading) {
    hideThreeLoading = message.info({
      content: "3d场景加载中",
      duration: 0
    });
  }
};
DefaultLoadingManager.onLoad = () => {
  if (hideThreeLoading) {
    hideThreeLoading();
    hideThreeLoading = null;
  }
};

export default abstract class Renderer<
  EventTypes extends EventEmitter.ValidEventTypes = ALL_RENDER_EVENT,
  Context = any
> extends EventEmitter<EventTypes, Context> {
  initialized: boolean;

  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;

  timer: Timer;

  resizeOb?: ResizeObserver;

  stats: Stats;

  constructor() {
    super();

    this.initialized = false;

    this.renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(-22, 0, 12);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.updateControls();

    this.timer = new Timer();

    this.stats = new Stats();
  }

  initialize(canvasId: string) {
    this.initialized = true;
    const container = document.getElementById(canvasId);
    if (!container) throw new Error(`Container not found: ${canvasId}`);
    const { clientWidth: width, clientHeight: height } = container;

    this.updateDimension(width, height);
    this.resizeOb = new ResizeObserver(
      debounce(() => {
        this.updateDimension(container.clientWidth, container.clientHeight);
      }, 200)
    );
    this.resizeOb.observe(container);

    container.appendChild(this.renderer.domElement);

    this.createLights();

    this.render();
  }

  updateControls() {
    this.controls.update();
    this.controls.saveState();

    this.camera.updateProjectionMatrix();
  }

  updateDimension(width: number, height: number) {
    if (!this.initialized) return;
    this.camera.aspect = width / height;
    this.updateControls();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  createLights() {
    const ambientLight = new AmbientLight(0xffffff, 0.8);
    const hemisphereLight = new HemisphereLight(0xffffff, 0x000000, 1);
    hemisphereLight.position.set(0, 0, 1);
    this.scene.add(ambientLight, hemisphereLight);
  }

  renderLoop() {
    this.timer.update();
    const delta = this.timer.getDelta();

    if (this.scene.userData.mixers) {
      Object.values<AnimationMixer>(this.scene.userData.mixers).forEach(
        (mixer) => {
          mixer.update(delta);
        }
      );
    }

    this.renderer.render(this.scene, this.camera);

    this.stats.update();
  }

  render() {
    this.renderer.setAnimationLoop(this.renderLoop.bind(this));
  }

  dispose() {
    this.renderer.domElement.remove();
    this.renderer.dispose();
    this.controls.dispose();
    this.resizeOb?.disconnect();
    this.stats.dispose();
    this.initialized = false;
  }
}
