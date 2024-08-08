import {
  Color,
  Euler,
  FrontSide,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3
} from "three";

import { ALL_TOPICS, VIRTUAL_RENDER_MAP } from "../constants/topic";
import ArrowRender from "./render/ArrowRender";
import CrosswalkRender from "./render/CrosswalkRender";
import CylinderRender from "./render/CylinderRender";
import type { UpdateData as EgoCarUpdateData } from "./render/EgoCarRender";
import EgoCarRender from "./render/EgoCarRender";
import EllipseRender from "./render/EllipseRender";
import FixedPolygonRender from "./render/FixedPolygonRender";
import FreespaceRender from "./render/FreespaceRender";
import PoleRender from "./render/PoleRender";
import PolygonRender from "./render/PolygonRender";
import PolylineRender from "./render/PolylineRender";
import RoadMarkerRender from "./render/RoadMarkerRender";
import SphereRender from "./render/SphereRender";
import TargetRender from "./render/TargetRender";
import TextSpriteRender from "./render/TextSpriteRender";
import TrafficLightRender from "./render/TrafficLightRender";
import TrafficSignalRender from "./render/TrafficSignalRender";
import type { VIRTUAL_RENDER_TYPE } from "./typings";
import emitter from "./utils/renderEmitter";
import type RenderObject from "./utils/RenderObject";
import RenderScene from "./utils/RenderScene";

export default class Virtual extends RenderScene {
  carRender: EgoCarRender;

  createRender: {
    [K in VIRTUAL_RENDER_TYPE]: RenderObject[];
  };

  ground = new Group();

  /** 作用于跟随车辆 */
  pos = new Vector3();
  euler = new Euler();
  prePos?: Vector3;
  deltaPos = new Vector3();
  targetOffset = new Vector3(3, 0, 6); // 相机在车辆后方的偏移量
  cameraOffset = new Vector3(-22, 0, 12); // 相机在车辆后方的偏移量

  constructor() {
    super();

    this.carRender = new EgoCarRender(this.scene);

    this.createRender = {
      arrow: VIRTUAL_RENDER_MAP.arrow.map(
        (topic) => new ArrowRender(this.scene, topic)
      ),
      crosswalk: VIRTUAL_RENDER_MAP.crosswalk.map(
        (topic) => new CrosswalkRender(this.scene, topic)
      ),
      cylinder: VIRTUAL_RENDER_MAP.cylinder.map(
        (topic) => new CylinderRender(this.scene, topic)
      ),
      ellipse: VIRTUAL_RENDER_MAP.ellipse.map(
        (topic) => new EllipseRender(this.scene, topic)
      ),
      fixedPolygon: VIRTUAL_RENDER_MAP.fixedPolygon.map(
        (topic) => new FixedPolygonRender(this.scene, topic)
      ),
      freespace: VIRTUAL_RENDER_MAP.freespace.map(
        (topic) => new FreespaceRender(this.scene, topic)
      ),
      poleModel: VIRTUAL_RENDER_MAP.poleModel.map(
        (topic) => new PoleRender(this.scene, topic)
      ),
      polygon: VIRTUAL_RENDER_MAP.polygon.map(
        (topic) => new PolygonRender(this.scene, topic)
      ),
      polyline: VIRTUAL_RENDER_MAP.polyline.map(
        (topic) => new PolylineRender(this.scene, topic)
      ),
      roadMarkerModel: VIRTUAL_RENDER_MAP.roadMarkerModel.map(
        (topic) => new RoadMarkerRender(this.scene, topic)
      ),
      sphere: VIRTUAL_RENDER_MAP.sphere.map(
        (topic) => new SphereRender(this.scene, topic)
      ),
      target: VIRTUAL_RENDER_MAP.target.map(
        (topic) => new TargetRender(this.scene, topic)
      ),
      text_sprite: VIRTUAL_RENDER_MAP.text_sprite.map(
        (topic) => new TextSpriteRender(this.scene, topic)
      ),
      trafficLightModel: VIRTUAL_RENDER_MAP.trafficLightModel.map(
        (topic) => new TrafficLightRender(this.scene, topic)
      ),
      trafficSignalModel: VIRTUAL_RENDER_MAP.trafficSignalModel.map(
        (topic) => new TrafficSignalRender(this.scene, topic)
      )
    };

    this.addEvents();

    this.preload().finally(() => {
      this.emit("loaded");
    });
  }

  updateCarPos = (data: { data: EgoCarUpdateData }) => {
    const { position, rotation } = data.data.data[0];

    if (this.carRender.car) this.carRender.update(data.data);

    this.pos.set(position.x, position.y, Math.max(position.z, 0));
    this.euler.set(rotation.x, rotation.y, rotation.z);

    // 更新地面的位置和旋转
    this.ground.position.copy(this.pos);
    this.ground.rotation.z = rotation.z;

    if (!this.prePos) {
      // 首次更新：计算相对位置和旋转
      const cameraOffset = this.cameraOffset.clone().applyEuler(this.euler);
      const targetOffset = this.targetOffset.clone().applyEuler(this.euler);

      this.camera.position.copy(this.pos.clone().add(cameraOffset));
      this.camera.lookAt(this.pos);
      this.controls.target.copy(this.pos.clone().add(targetOffset));
      this.prePos = this.pos.clone();
    } else {
      // 后续更新：根据位置增量调整相机
      this.deltaPos.subVectors(this.pos, this.prePos);
      this.camera.position.add(this.deltaPos);
      this.controls.target.add(this.deltaPos);
      this.prePos.copy(this.pos);
    }
  };

  addEvents() {
    this.on("enable", (data) => {
      const type = data.type as VIRTUAL_RENDER_TYPE;
      const topicMap = this.createRender[type];
      const render = topicMap.find((render) => render.topic === data.topic);
      if (!render) {
        console.error(type, `[${data.topic}] not found`);
      } else {
        render.setEnable(data.enable);
      }
    });

    emitter.on(ALL_TOPICS.CAR_POSE, this.updateCarPos);
  }

  async preload() {
    const preloadArray = [
      RoadMarkerRender,
      PoleRender,
      TrafficLightRender,
      TrafficSignalRender
    ];
    return Promise.allSettled(
      preloadArray.map((modelRender) => modelRender.preloading())
    );
  }

  initialize(canvasId: string) {
    super.initialize(canvasId);
    this.updateControler();
    this.setScene();
  }

  updateControler() {
    this.camera.position.copy(this.cameraOffset);
    this.controls.target.copy(this.targetOffset);
    this.updateControls();
  }

  setScene() {
    const size = 1000;
    const gridColor = new Color(0x888888).multiplyScalar(0.3);
    const gridHelper = new GridHelper(
      size / 2,
      size / 20,
      gridColor,
      gridColor
    );

    gridHelper.material.depthWrite = false;
    gridHelper.rotation.x = Math.PI / 2;

    const geometry = new PlaneGeometry(size / 2, size / 2);
    const material = new MeshBasicMaterial({
      color: 0x232829,
      side: FrontSide,
      depthWrite: false
    });
    const ground = new Mesh(geometry, material);
    ground.renderOrder = -1;
    this.ground.add(ground, gridHelper);
    this.scene.add(this.ground);
  }

  dispose(): void {
    Object.values(this.createRender).forEach((renders) => {
      renders.forEach((render) => {
        render.dispose();
      });
    });
    this.removeAllListeners();
    emitter.off(ALL_TOPICS.CAR_POSE, this.updateCarPos);
    super.dispose();
  }
}
