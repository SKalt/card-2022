import {} from "@babylonjs/loaders";
import { Scene } from "@babylonjs/core/scene";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  GlowLayer,
  Mesh,
  PBRMaterial,
  PointColor,
  PointsCloudSystem,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core";
import { log, done } from "$lib/log";
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

export async function doTheThing(canvas: HTMLCanvasElement, baseUrl: string) {
  const engine = await createEngine(canvas);
  log.set({ percent: 50, message: "loading assets: 0% loaded" });
  const scene = new Scene(engine);
  (window as any).scene = scene;
  scene.createDefaultCamera(true, true, true);
  scene.createDefaultSkybox(undefined);
  const onProgress = () => {
    log.set({ message: "loading assets: 90% loaded", percent: 70 });
  };
  {
    SceneLoader.ShowLoadingScreen = false;
    await SceneLoader.AppendAsync(baseUrl, "patterson_park.glb", scene, onProgress, null)
      .catch(console.error)
      .finally(() => console.log("done"));
    log.set({ message: "preparing lights", percent: 80 });
    const led = new PBRMaterial("LED", scene);
    led.emissiveColor = Color3.FromHexString("#f0b904");
    led.ambientColor = Color3.FromHexString("#ee9911");
    led.metallic = 0;
    const glow = new GlowLayer("glow", scene, { mainTextureSamples: 2 });
    scene.meshes.forEach((m) => {
      if (m.name.startsWith("Basic_Sphere")) {
        m.material = led;
        glow.addIncludedOnlyMesh(m as Mesh);
      }
    });
  }
  {
    log.set({ message: "initializing snow", percent: 98 });
    const sphere = MeshBuilder.CreateSphere("dome", { diameter: 49.5 });
    sphere.registerAfterWorldMatrixUpdate(async () => {
      // need to wait for sphere to be shifted up before creating snow
      const snow = new PointsCloudSystem("snow", 1, scene);
      snow.addVolumePoints(sphere, 4000, PointColor.Stated, new Color4(255, 255, 255, 1));
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

  camera.attachControl(canvas, true);
  scene.setActiveCameraById("Camera");
  {
    const emitter = scene.meshes.find((m) => m.id == "snow_emitter");
    if (emitter) {
      emitter.isVisible = false;
    }
  }

  window.addEventListener("resize", () => engine.resize());
  engine.runRenderLoop(() => scene.render());
  done.set(true);
}
