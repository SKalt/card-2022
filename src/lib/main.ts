import { GLTF2, GLTFFileLoader } from "@babylonjs/loaders/glTF";
import {} from "@babylonjs/loaders";
import { Scene } from "@babylonjs/core/scene";
import { Engine, FreeCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import { MeshBuilder } from "@babylonjs/core";
export async function doTheThing(
  ctx: HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext,
  baseUrl: string,
) {
  const engine = new Engine(ctx);
  const scene = new Scene(engine);
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  // Dim the light a small amount 0 - 1
  light.intensity = 0.7;
  // scene.createDefaultCamera(true, true, true);
  // scene.createDefaultSkybox(undefined);
  await SceneLoader.AppendAsync(baseUrl, "patterson_park_.glb", scene, console.log, null)
    .catch(console.error)
    .finally(() => console.log("done"));
  console.log({ scene });
  const sphere = MeshBuilder.CreateSphere("ref", { diameter: 2, segments: 32 }, scene);
  sphere.position.y = 1;
  // const loader = new SceneLoader();
  // loader.append()
  // const loader = new GLTFFileLoader();
  // const _loader = new GLTF2.GLTFLoader(loader)
  // loader.loadAsync(scene, null, baseUrl, console.log, "patterson_park_.glb");
}
