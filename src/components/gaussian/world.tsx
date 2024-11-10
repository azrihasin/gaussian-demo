"use client";

import {RigidBody} from "@react-three/rapier";

const World = () => {
  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0}>
        {/** Floor */}
        <mesh>
          <boxGeometry args={[20, 0.1, 20]} />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false} />
        </mesh>
        {/** ************* */}

        {/** Walls */}
        <mesh position={[1.04, 3.84, -8.72]} scale={[22.98, 8, 1]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[1.1, 3.96, 6.58]} scale={[21.5, 8, 1]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[-5.66, 3.9, 0.32]} scale={[1, 8.14, 18.72]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[10.04, 3.98, -0.9]} scale={[1, 7.98, 15.88]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};

export default World;
