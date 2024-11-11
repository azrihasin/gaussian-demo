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
import dynamic from "next/dynamic";

const DynamicTextureLoader = dynamic(() => import("../../components/TextureLoaderComponent"), {
  ssr: false,
});

const models = [
  {
    title: "Showroom",
    splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/showroom.splat",
    position: [4.72, 15.74, -0.44],
    rotation: [-0.6904240233560722, -1.5288819193970289, -0.6879440802875763],
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
  // {
  //   title: "Art Gallery",
  //   splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/gallery1.splat",
  //   position: [-0.06, 0.1, -0.06],
  //   rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
  //   walls: [
  //     {
  //       position: [0, 0, 0],
  //       rotation: [0, 0, 0],
  //       scale: [1, 1, 1],
  //       transparent: true,
  //       opacity: 0,
  //       depthWrite: false,
  //     },
  //   ],
  //   description:
  //     "A modal dialog that interrupts the user with important content and expects a response.",
  // },
  // {
  //   title: "Library",
  //   splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/library_splat.splat",
  //   position: [16.5, 17.24, -58.94],
  //   rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
  //   walls: [
  //     {
  //       position: [0, 0, 0],
  //       rotation: [0, 0, 0],
  //       scale: [1, 1, 1],
  //       transparent: true,
  //       opacity: 0,
  //       depthWrite: false,
  //     },
  //   ],
  //   description:
  //     "A modal dialog that interrupts the user with important content and expects a response.",
  // },
  // {
  //   title: "Library 4",
  //   splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/library_splat4.splat",
  //   position: [4.72, -2.12, -0.44],
  //   rotation: [-3.0512971439889047, -1.2703544126533588, -3.0532728059962246],
  //   walls: [
  //     {
  //       position: [0, 0, 0],
  //       rotation: [0, 0, 0],
  //       scale: [1, 1, 1],
  //       transparent: true,
  //       opacity: 0,
  //       depthWrite: false,
  //     },
  //   ],
  //   description:
  //     "A modal dialog that interrupts the user with important content and expects a response.",
  // },
  // {
  //   title: "Room 2",
  //   splat: "https://huggingface.co/datasets/azrihasin/test/resolve/main/room.splat",
  //   position: [-0.06, 0.1, -0.06],
  //   rotation: [3.066487658638269, 0.009413570534283353, -3.1169034930113315],
  //   walls: [
  //     {
  //       position: [0, 0, 0],
  //       rotation: [0, 0, 0],
  //       scale: [1, 1, 1],
  //       transparent: true,
  //       opacity: 0,
  //       depthWrite: false,
  //     },
  //   ],
  //   description:
  //     "A modal dialog that interrupts the user with important content and expects a response.",
  // },
];

export default function Gaussian() {
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem]: any = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [selectedModel, setSelectedModel]: any = useState(models[0]);

  const [textureItenary, setTextureItenary] = useState(null);
  const [textureUnifi, setTextureUnifi] = useState(null);
  const [textureFdp, setTextureFdp] = useState(null);
  const [textureWeb, setTextureWeb] = useState(null);

  const closeDialog = () => {
    setOpen(false);
  };

  const openPortal = (id: any, title: any, href: any) => {
    setCurrentItem({
      name: title,
      image: getImageLink(title),
      desc: getDescription(title),
      href,
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

  const imageLinks = [
    {
      title: "Itenary Generator",
      link: "/blog/ai-powered-itinerary-generator",
      image:
        "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/itenary-generator-intro.jpg",
      desc: "Travel planning has come a long way. Gone are the days of physically visiting travel agencies, rifling through brochures, or spending countless hours researching destinations and attractions. The advent of the internet brought online travel agencies and review platforms like TripAdvisor, drastically transforming the way we plan our trips. However, even with these tools, crafting a well-thought-out, efficient itinerary can still be a daunting task. The process of gathering all the necessary information and fitting it together seamlessly to ensure a smooth journey can be both time-consuming and stressful. That's where an AI-powered itinerary generator comes into play, offering a more streamlined and personalized approach to travel planning.",
    },
    {
      title: "Unifi AR",
      link: "/blog/unifi-ar-troubleshooting-guide",
      image:
        "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/unifi-ar-intro.jpg",
      desc: "In today's hyper-connected world, reliable and efficient internet connectivity is paramount. As the digital age progresses, more sophisticated and comprehensive solutions are required to keep up with increasing demandsndable internet ccess. However, like all technology, they are not immune to occasional hiccups and technical issues. For most people, troubleshooting network equipment can be a daunting task filled with confusing steps and technical jargon. Fortunately, advancements in web applications and augmented reality (AR) are changing this landscape. This blog explores a revolutionary web application designed to simplify UNIFI equipment troubleshooting, leveraging the power of augmented reality to provide intuitive and effective guidance for users.",
    },
    {
      title: "FDP Application",
      link: "/blog/geolocation-dashboard-for-fdp-deployment",
      image:
        "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/fdp-application-intro.jpg",
      desc: "In the dynamic landscape of Fiber Distribution Point (FDP) deployment, having real-time insights and a cohesive overview of your installations can be a game-changer. The ability to monitor, analyze, and manage the deployment process effectively is crucial for ensuring efficiency, detecting potential issues, and optimizing resources. This is where a sophisticated web application featuring geolocation and advanced dashboards comes into play. By integrating heat maps, geolocation tracking, and comprehensive FDP mapping, this innovative tool provides key influencers with a seamless and intuitive view of FDP installations.",
    },
    {
      title: "Angular Web Template",
      link: "/blog/transforming-advertising-with-augmented-reality",
      image:
        "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/angular-web-template-intro.jpg",
      desc: "In the ever-evolving landscape of advertising, capturing consumer attention and delivering impactful messages is a persistent challenge. Brands are constantly seeking new and innovative ways to stand out in a crowded market. Enter augmented reality (AR), a groundbreaking technology that is redefining how ads are created, delivered, and experienced. Today, we explore Unifi's pioneering initiative to use augmented reality to take advertising to the next level, allowing users to scan competing telco ads and seamlessly overlay them with engaging Unifi advertisements.",
    },
  ];

  // const textureItenary = useLoader(
  //   TextureLoader,
  //   "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/patrol-image.png"
  // ); // Placeholder image
  // const textureUnifi = useLoader(TextureLoader, "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/swims-image.png"); // Placeholder image
  // const textureFdp = useLoader(
  //   TextureLoader,
  //   "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/eptw-image.png"
  // ); // Placeholder image
  // const textureWeb = useLoader(
  //   TextureLoader,
  //   "https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/sifu-image.png"
  // ); // Placeholder image

  const getImageLink = (title: any) => {
    const image = imageLinks.find((item) => item.title.toLowerCase() === title.toLowerCase());
    return image ? image.image : null;
  };

  const getDescription = (title: any) => {
    const description = imageLinks.find((item) => item.title.toLowerCase() === title.toLowerCase());
    return description ? description.desc : null;
  };

  return (
    <>
      {/* Load each texture dynamically only if not already loaded */}
      {!textureItenary && (
        <DynamicTextureLoader
          url="https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/itenary-generator-intro.jpg"
          onLoad={(texture: any) => setTextureItenary(texture)}
        />
      )}
      {!textureUnifi && (
        <DynamicTextureLoader
          url="https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/unifi-ar-intro.jpg"
          onLoad={(texture: any) => setTextureUnifi(texture)}
        />
      )}
      {!textureFdp && (
        <DynamicTextureLoader
          url="https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/fdp-application-intro.jpg"
          onLoad={(texture: any) => setTextureFdp(texture)}
        />
      )}
      {!textureWeb && (
        <DynamicTextureLoader
          url="https://raw.githubusercontent.com/azrihasin/gaussian-demo-assets/refs/heads/main/angular-web-template-intro.jpg"
          onLoad={(texture: any) => setTextureWeb(texture)}
        />
      )}
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
              src="https://huggingface.co/datasets/azrihasin/test/resolve/main/showroom.splat"
              position={[4.72, 14.24, -0.44]} // Y position reduced by 1.5
              rotation={[-0.6904240233560722, -1.5288819193970289, -0.6879440802875763]}
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
            onClick={() =>
              openPortal(1, "Itenary Generator", "/blog/ai-powered-itinerary-generator")
            }
            position={[0.88, 4.22 - 2, -4]} // Decrease y by 2
            scale={[1.52, 0.92, 0.92]}
            rotation={[0, 0, -0.017453292519943295]}>
            <planeGeometry />
            <meshStandardMaterial map={textureItenary} side={THREE.DoubleSide} />
          </mesh>

          <mesh
            onClick={() => openPortal(1, "Unifi AR", "/blog/unifi-ar-troubleshooting-guide")}
            position={[4.64 - 1, 4.22 - 2, 3.28]} // Decrease z by 10 to move behind
            scale={[1.52, 0.92, 0.92]}
            renderOrder={5}
            rotation={[0, 0, -0.017453292519943295]}>
            <planeGeometry />
            <meshStandardMaterial side={THREE.DoubleSide} />
          </mesh>

          <mesh
            onClick={() =>
              openPortal(1, "FDP Application", "/blog/geolocation-dashboard-for-fdp-deployment")
            }
            position={[0.66, 4.24 - 2, 3.38]} // Decrease y by 2
            scale={[1.52, 0.92, 0.92]}
            rotation={[0, 0, -0.017453292519943295]}>
            <planeGeometry />
            <meshStandardMaterial map={textureFdp} side={THREE.DoubleSide} />
          </mesh>

          <mesh
            onClick={() =>
              openPortal(
                1,
                "Angular Web Template",
                "/blog/transforming-advertising-with-augmented-reality"
              )
            }
            position={[4.64, 4.22 - 2, -3.96]} // Decrease y by 2
            scale={[1.52, 0.92, 0.92]}
            rotation={[0, 0, -0.017453292519943295]}>
            <planeGeometry />
            <meshStandardMaterial map={textureWeb} side={THREE.DoubleSide} />
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
              <a
                className="block"
                href="/blog/ai-powered-itinerary-generator"
                aria-disabled="false"
                data-discover="true">
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
              <a
                className="block"
                href="/blog/unifi-ar-troubleshooting-guide"
                aria-disabled="false"
                data-discover="true">
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
              <a
                className="block"
                href="/blog/geolocation-dashboard-for-fdp-deployment"
                aria-disabled="false"
                data-discover="true">
                FDP Application
              </a>
            </li>
            <li
              className={`transition-visibility text-2xl font-bold leading-tight transition-all duration-1000 ease-in-out ${
                isClicked
                  ? "visible translate-x-0 opacity-100"
                  : "pointer-events-none invisible -translate-x-[10px] opacity-0"
              }`}
              style={{transitionDelay: "250ms"}}>
              <a
                className="block"
                href="/blog/transforming-advertising-with-augmented-reality"
                aria-disabled="false"
                data-discover="true">
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
                <Image src={currentItem.image} alt="Your Image" width={300} height={200} />
              </div>
            </div>
            <div className="flex size-96 flex-col items-center px-6">
              <p className="overflow-hidden text-ellipsis line-clamp-8">
                {currentItem.desc}
              </p>
              <a href={currentItem.href} className="text-blue-500 hover:underline mt-2 self-start">
                See more...
              </a>
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
