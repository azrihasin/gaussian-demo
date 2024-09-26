"use client"

import {RigidBody} from "@react-three/rapier";

const World = () => {
  return (
    <>
      <RigidBody type="fixed" friction={0} restitution={0}>
        {/** *****Cube Obstacles */}
        {/* {[...new Array(10)].map((item, index) => {
          return (
            <mesh
              key={index}
              position={[
                (Math.random() - 0.5) * 20,
                0.5,
                (Math.random() - 0.5) * 20
              ]}
            >
              <boxGeometry />
              <meshStandardMaterial color="#da8a22" />
            </mesh>
          );
        })} */}

        {/** Floor */}
        <mesh>
          <boxGeometry args={[20, 0.1, 20]} />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false} />
        </mesh>
        {/** ************* */}

        {/** Walls */}
        {/* <mesh position={[10, 0.5, 0]}>
          <boxGeometry args={[0.1, 3, 20]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[-10, 0.5, 0]}>
          <boxGeometry args={[0.1, 3, 20]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[0, 0.5, 10]}>
          <boxGeometry args={[20, 3, 0.1]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh>
        <mesh position={[0, 0.5, -10]}>
          <boxGeometry args={[20, 3, 0.1]} />
          <meshStandardMaterial color="#8899aa" />
        </mesh> */}
        <mesh position={[2.36, 3, 1.82]} scale={[3.24, 6, 3.44]}>
          <boxGeometry />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false}/>
        </mesh>
        <mesh position={[1.04, 3.84, -1.98]} scale={[14, 8, 1]}>
          <boxGeometry />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false}/>
        </mesh>
        <mesh position={[1.1, 3.96, 2.32]} scale={[14, 8, 1]}>
          <boxGeometry />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false}/>
        </mesh>
        <mesh position={[-4.92, 3.9, 0.32]} scale={[1, 8, 8.46]}>
          <boxGeometry />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false}/>
        </mesh>
        <mesh position={[6.94, 3.92, 0.36]} scale={[1, 7.98, 8.46]}>
          <boxGeometry />
          <meshStandardMaterial transparent={true} opacity={0} depthWrite={false}/>
        </mesh>
        {/** ************* */}
      </RigidBody>
    </>
  );
};

export default World;
