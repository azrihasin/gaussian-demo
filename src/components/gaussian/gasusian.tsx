/* eslint-disable no-irregular-whitespace */
/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-unused-vars */
"use client";

import React, {useRef, useState, useEffect} from "react";
import {Canvas, useLoader} from "@react-three/fiber";
import {KeyboardControls, Splat, Decal, OrbitControls} from "@react-three/drei";
import {Physics} from "@react-three/rapier";
// import World from "./World.jsx";
// import FPScontrols from "./FPScontrols.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {TextureLoader} from "three";
import {GearIcon} from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Leva, useControls} from "leva";
import * as THREE from "three";
import World from "./world";
import FPScontrols from "./controls";

const models = [
  {
    title: "Art Gallery",
    splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/gallery1.splat",
    position: [-0.06, 0.1, -0.06],
    rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
    walls: [
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        transparent: true,
        opacity: 0,
        depthWrite: false,
      },
    ],
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Library",
    splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/library_splat.splat",
    position: [16.5, 17.24, -58.94],
    rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
    walls: [
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        transparent: true,
        opacity: 0,
        depthWrite: false,
      },
    ],
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Library 4",
    splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/library_splat4.splat",
    position: [4.72, -2.12, -0.44],
    rotation: [-3.0512971439889047, -1.2703544126533588, -3.0532728059962246],
    walls: [
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        transparent: true,
        opacity: 0,
        depthWrite: false,
      },
    ],
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Room 2",
    splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/room.splat",
    position: [-0.06, 0.1, -0.06],
    rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
    walls: [
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        transparent: true,
        opacity: 0,
        depthWrite: false,
      },
    ],
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
];

export default function Gaussian() {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem]: any = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [selectedModel, setSelectedModel]: any = useState(models[1]);

  const closeDialog = () => {
    setOpen(false);
  };

  const openPortal = (id: any, title: any) => {
    setCurrentItem({
      name: title,
      image: `${id}.png`,
    });
    setOpen(true);
  };

  const openExplore = () => {
    setIsClicked(!isClicked);
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
  };

//   const itenary = useLoader(TextureLoader, "/itenary.png");
//   const fdp = useLoader(TextureLoader, "/fdp.png");
//   const unifi = useLoader(TextureLoader, "/unifi.png");
//   const ad = useLoader(TextureLoader, "/ad.png");

  const splatRef: any = useRef();

  useEffect(() => {
    console.log("Selected model updated:", selectedModel.title);
    if (splatRef.current) {
      splatRef.current.needsUpdate = true;
    }
  }, [selectedModel]);

  // On screen controls
  const {throttleDpr, maxDpr, throttleSplats, maxSplats}: any = useControls({
    // url: {label: "Model URL", options: models[0].splat},
    throttleDpr: {
      label: "Degrade pixel ratio based on perf.",
      value: false,
    },
    // maxDpr: {label: "Max pixel ratio", value: window?.devicePixelRatio ?? 1},
    throttleSplats: {
      label: "Degrade splat count based on perf.",
      value: false,
    },
    maxSplats: {label: "Max splat count", value: 10000000},
  });

  // Performance factor
  const [factor, setFactor] = useState(1);

  // Downsample pixels if perf gets bad
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor));

  // Downsample splats if perf gets bad
  const [splats, setSplats] = useState(maxSplats);

  const effectiveSplats: any = throttleSplats ? Math.min(maxSplats, splats) : maxSplats;

  return (
    <>
      <Leva hidden={true} />
      <div
        className={`inset-0 ${
          isClicked ? "pointer-events-none blur-lg" : ""
        } transition-all duration-300`}
        style={{height: "100vh", width: "100vw"}}>
        <div className="absolute left-0 top-0 z-50 w-full px-9 py-6">
          <h1 className="text-4xl font-bold text-white">Initiative Demo.</h1>
          <div className="mt-2 flex items-center">
            <p className="mr-3 text-xl font-bold text-white">{selectedModel.title}</p>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent"
                    onPointerMove={(event) => event.preventDefault()}
                    onPointerLeave={(event) => event.preventDefault()}>
                    <GearIcon />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {models.map((model) => (
                        <ListItem
                          key={model.title}
                          title={model.title}
                          onClick={() => handleModelSelect(model)}>
                          {model.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <Canvas flat shadows dpr={[1, 2]}>
          <Physics>
            <Splat
              ref={splatRef}
              key={selectedModel.title}
              src={selectedModel.splat}
              position={selectedModel.position}
              rotation={selectedModel.rotation}
            />
            <World />
            <KeyboardControls
              map={[
                {name: "forwardKeyPressed", keys: ["ArrowUp", "KeyW"]},
                {name: "rightKeyPressed", keys: ["ArrowRight", "KeyD"]},
                {name: "backwardKeyPressed", keys: ["ArrowDown", "KeyS"]},
                {name: "leftKeyPressed", keys: ["ArrowLeft", "KeyA"]},
              ]}>
              <FPScontrols />
            </KeyboardControls>
          </Physics>
          <ambientLight intensity={0.3} />

          <directionalLight intensity={1} position={[2, 7, 7]} />
          <directionalLight intensity={0.5} position={[-2, -7, -3]} />

          <OrbitControls
            target={[5, 0, 0]}
            mouseButtons={{
              LEFT: THREE.MOUSE.PAN,
              RIGHT: THREE.MOUSE.ROTATE,
            }}
          />
          <mesh
            onClick={() => openPortal("unifi", "UNIFI Equipment Troubleshooting Guide​")}
            position={[-3.42, 1.92, -0.96]}
            scale={[0.92, 0.56, 0.92]}
            rotation={[0, 0.9773843811168286, 0]}>
            <planeGeometry />
            {/* <Decal
              position={[0, 0, 0.01]}
              rotation={[0, 0, 0]}
              scale={[0.92, 0.56, 0.92]}
              map={unifi}
            /> */}
          </mesh>
          <mesh
            onClick={() =>
              openPortal("fdp", "Geolocation & Dashboard for Key Influencer of FDP Deployment")
            }
            position={[-3.04, 1.92, 1.4]}
            scale={[0.92, 0.56, 0.92]}
            rotation={[-3.141592653589793, 0.5061454830783527, -3.141592653589793]}>
            <planeGeometry />
            {/* <Decal
              position={[0, 0, 0.01]} // Slightly in front of the plane
              rotation={[0, 0, 0]} // No rotation
              scale={[0.92, 0.56, 0.92]}
              map={fdp}
            /> */}
          </mesh>
          <mesh
            onClick={() => openPortal("ad", "Angular Web Template ")}
            position={[-0.22, 1.92, 1.04]}
            scale={[0.92, 0.56, 0.92]}
            rotation={[3.141592653589793, -0.8552113334772216, 3.141592653589793]}>
            <planeGeometry />
            {/* <Decal
              position={[0, 0, 0.01]} // Slightly in front of the plane
              rotation={[0, 0, 0]} // No rotation
              scale={[0.92, 0.56, 0.92]}
              map={ad}
            /> */}
          </mesh>
          <mesh
            onClick={() => openPortal("itenary", "Itinerary Generator")}
            position={[-1.56, 1.92, -1.6]}
            scale={[0.92, 0.56, 0.92]}>
            <planeGeometry />
            {/* <Decal
              position={[0, 0, 0.01]} // Slightly in front of the plane
              rotation={[0, 0, 0]} // No rotation
              scale={[0.8, 0.4, 0.8]}
              map={useLoader(TextureLoader, "/itenary.png")}
            /> */}
          </mesh>
        </Canvas>
      </div>

      <div
        className="fixed inset-y-0 left-0 size-full max-w-[353px] translate-x-0 text-left transition-all [transition:transform_900ms_cubic-bezier(.165,.84,.44,1),width_300ms_ease-in-out] md:absolute"
        style={{width: "calc(100vw - 135px)"}}>
        <div className="duration-[350ms] visible absolute inset-y-0 left-0 flex size-full items-end justify-start px-6 pb-20 pt-28 opacity-100 transition-[opacity,visibility] ease-in-out">
          <ul className="header-nav-list">
            <li
              // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
              className={`transition-visibility text-2xl font-bold leading-tight transition-all duration-1000 ease-in-out ${
                isClicked
                  ? "visible translate-x-0 opacity-100"
                  : "pointer-events-none invisible -translate-x-[10px] opacity-0"
              }`}
              style={{transitionDelay: "300ms"}}>
              <a className="block" href="/blog/ai-powered-itinerary-generator" aria-disabled="false" data-discover="true">
                Itinerary Generator
              </a>
            </li>
            <li
              // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
              className={`transition-visibility text-2xl font-bold leading-tight transition-all duration-1000 ease-in-out ${
                isClicked
                  ? "visible translate-x-0 opacity-100"
                  : "pointer-events-none invisible -translate-x-[10px] opacity-0"
              }`}
              style={{transitionDelay: "350ms"}}>
              <a className="block" href="/blog/unifi-ar-troubleshooting-guide" aria-disabled="false" data-discover="true">
                UNIFI AR
              </a>
            </li>
            <li
              className={`transition-visibility text-2xl font-bold leading-tight transition-all duration-1000 ease-in-out ${
                isClicked
                  ? "visible translate-x-0 opacity-100"
                  : "pointer-events-none invisible -translate-x-[10px] opacity-0"
              }`}
              style={{transitionDelay: "400ms"}}>
              <a className="block" href="/blog/geolocation-dashboard-for-fdp-deployment" aria-disabled="false" data-discover="true">
                FDP Applcation
              </a>
            </li>
            <li
              className={`transition-visibility text-2xl font-bold leading-tight transition-all duration-1000 ease-in-out ${
                isClicked
                  ? "visible translate-x-0 opacity-100"
                  : "pointer-events-none invisible -translate-x-[10px] opacity-0"
              }`}
              style={{transitionDelay: "250ms"}}>
              <a className="block" href="/blog/transforming-advertising-with-augmented-reality" aria-disabled="false" data-discover="true">
                Angular Web Template
              </a>
            </li>
            <li className={`select-none text-2xl font-bold leading-tight`}>
              <p onClick={openExplore} className="block cursor-pointer select-none">
                Explore
              </p>
            </li>
          </ul>
        </div>
      </div>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle className="pl-4 text-3xl">{currentItem.name}</DialogTitle>
          </DialogHeader>
          <div className="flex px-4 py-8">
            <div className="mr-6 flex size-96 items-center justify-center rounded-xl bg-gradient-to-r from-slate-50 to-slate-200">
              <div className="relative max-h-64 max-w-64 text-clip">
                <Image src={`/${currentItem.image}`} alt="Your Image" width={300} height={200} />
              </div>
            </div>
            <div className="flex size-96 items-center px-6">
              <p>
                Mattis nunc sed blandit libero volutpat sed cras. Sit amet massa vitae tortor
                condimentum. Magna eget est lorem ipsum dolor sit amet. Cursus turpis massa
                tincidunt dui ut ornare. Fermentum iaculis eu non diam phasellus vestibulum lorem
                sed risus. Lobortis elementum nibh tellus molestie nunc non blandit. Condimentum
                lacinia quis vel eros donec ac odio tempor orci. Habitant morbi tristique senectus
                et netus et malesuada.
              </p>
            </div>
          </div>
          {/* <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
const ListItem = React.forwardRef(({className, title, children, ...props}: any, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
