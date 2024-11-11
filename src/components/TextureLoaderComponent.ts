// components/TextureLoaderComponent.js

import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

const TextureLoaderComponent = ({ url , onLoad }: any) => {
  const texture = useLoader(TextureLoader, url);
  onLoad(texture); // Pass the loaded texture back to the parent
  return null;
};

export default TextureLoaderComponent;
