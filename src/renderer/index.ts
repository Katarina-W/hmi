import {
  Color,
  FrontSide,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3
} from "three";

import { ALL_TOPICS, VIRTUAL_RENDER_MAP } from "../constants/topic";
import type { EgoCarUpdateData } from "./common";
import ArrowRender from "./render/ArrowRender";
import CrosswalkRender from "./render/CrosswalkRender";
import CylinderRender from "./render/CylinderRender";
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
  createRender: {
    [K in VIRTUAL_RENDER_TYPE]: RenderObject[];
  };

  ground = new Group();

  constructor() {
    super();

    this.createRender = {
      arrow: VIRTUAL_RENDER_MAP.arrow.map(
        (topic) => new ArrowRender(this.scene, topic)
      ),
      car_pose: VIRTUAL_RENDER_MAP.car_pose.map(
        (topic) => new EgoCarRender(this.scene, topic)
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

  prePos = new Vector3();

  updateCarPos = (data: { data: EgoCarUpdateData }) => {
    const [{ position, rotation }] = data.data.data;
    const pos = new Vector3(position.x, position.y, -0.3);
    this.ground.position.copy(pos);
    this.ground.rotation.z = rotation.z;

    const deltaPos = new Vector3().copy(pos).sub(this.prePos);

    this.camera.position.add(deltaPos);

    this.controls.target.add(deltaPos);

    this.prePos.copy(pos);

    this.updateControls();
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
    const cars = await EgoCarRender.preloading();
    cars.forEach((item) => {
      if (item.status === "fulfilled") {
        this.scene.add(item.value);
      }
    });
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
    this.controls.target.set(3, 0, 6);
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
