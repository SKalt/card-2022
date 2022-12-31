import { Scene } from "@babylonjs/core/scene";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  // GlowLayer,
  PBRMaterial,
  PointColor,
  PointsCloudSystem,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core";
import { log, done } from "$lib/log";
import * as gltf from "@babylonjs/loaders/glTF/2.0";
import { GLTFFileLoader } from "@babylonjs/loaders";

async function createEngine(canvas: HTMLCanvasElement): Promise<WebGPUEngine | Engine> {
  try {
    if (!(await WebGPUEngine.IsSupportedAsync)) {
      throw "Not Supported";
    }
    const engine = new WebGPUEngine(canvas, {
      deviceDescriptor: {
        requiredFeatures: [
          "depth-clip-control",
          "depth24unorm-stencil8",
          "depth32float-stencil8",
          "texture-compression-bc",
          "texture-compression-etc2",
          "texture-compression-astc",
          "timestamp-query",
          "indirect-first-instance",
        ],
      },
    });
    await engine.initAsync();
    return engine;
  } catch {
    return new Engine(canvas, true, {
      disableWebGL2Support: false,
      preserveDrawingBuffer: true,
      stencil: true,
    });
  }
}

export async function render3dScene(canvas: HTMLCanvasElement) {
  SceneLoader.RegisterPlugin(new GLTFFileLoader());

  const engine = await createEngine(canvas);
  log.set({ percent: 49, message: "Creating scene" });
  const scene = new Scene(engine);
  log.set({ percent: 50, message: "loading assets: 0% loaded" });
  const href = window.location.href;
  const _baseUrl = href.endsWith("/") ? href : href + "/";
  const file = "patterson_park.glb";

  Object.assign(window as any, { scene, engine, SceneLoader });
  const onProgress = () => {
    log.set({ message: "loading assets: 90% loaded", percent: 70 });
  };
  {
    {
      const light = new HemisphericLight("light", Vector3.Zero(), scene);
      light.intensity = 0.2;
    }
    SceneLoader.ShowLoadingScreen = false;
    await SceneLoader.AppendAsync(
      _baseUrl,
      file.replace(/^\//, ""), // compiler somehow adds a leading slash?
      scene,
      onProgress,
      null,
    )
      .catch((err) => {
        console.error(err);
        console.log(_baseUrl, file);
        throw err;
      })
      .finally(() => console.log("done"));
    log.set({ message: "preparing lights", percent: 80 });
    const led = new PBRMaterial("LED", scene);
    led.emissiveColor = Color3.FromHexString("#f0b904");
    led.ambientColor = Color3.FromHexString("#ee9911");
    led.metallic = 0;
    scene.meshes.forEach((m) => {
      if (m.name.startsWith("Basic_Sphere")) {
        m.material = led;
      }
    });
  }
  {
    log.set({ message: "initializing snow", percent: 98 });
    const sphere = MeshBuilder.CreateSphere("dome", { diameter: 49.5 });
    sphere.registerAfterWorldMatrixUpdate(async () => {
      // need to wait for sphere to be shifted up before creating snow
      const snow = new PointsCloudSystem("snow", 1, scene);
      snow.addVolumePoints(sphere, 3000, PointColor.Stated, Color3.White().toColor4());
      await snow.buildMeshAsync().then(() => sphere.dispose());
    });
    sphere.position.y = 13.7; // needed since world update doesn't take effect
  }
  const camera = new ArcRotateCamera(
    "Camera",
    Math.PI / 3,
    Math.PI / 3,
    100,
    Vector3.Zero(),
    scene,
    true,
  );
  scene.cameras.filter((c) => c.name != "Camera").forEach((c) => c.dispose());
  scene.clearColor = Color3.Black().toColor4();
  camera.attachControl(canvas, true);
  camera.useAutoRotationBehavior = true;
  scene.setActiveCameraById("Camera");
  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
  done.set(true);
}
