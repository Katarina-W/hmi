import type { Object3D, Scene, Vector3Like } from "three";

import { EgoCar as EgoCarModel } from "@/assets/model";

import type { UpdateDataTool } from "../typings";
import GLTFLoader from "../utils/loaders/GLTFLoader";

interface DataType {
  posWGS84: Vector3Like;
  position: Vector3Like;
  rotation: Vector3Like;
}

const gltfLoader = new GLTFLoader();

export interface UpdateData extends UpdateDataTool<DataType[]> {
  type: "car_pose";
}

export default class EgoCarRender {
  scene: Scene;
  car?: Object3D;

  constructor(scene: Scene) {
    this.scene = scene;
    this.preloading();
  }

  async preloading() {
    const gltf = await gltfLoader.loadAsync(EgoCarModel);
    const model = gltf.scene;
    this.car = model;
    this.scene.add(model);
  }

  setModelAttributes(model: Object3D, modelData: DataType) {
    const { position, rotation } = modelData;
    model.position.set(position.x, position.y, 0);
    model.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  update(data: UpdateData) {
    if (!data.data.length) return;
    data.data.forEach((item) => {
      if (this.car) {
        this.setModelAttributes(this.car, item);
      }
    });
  }
}
