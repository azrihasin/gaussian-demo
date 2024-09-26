import React, {PropsWithChildren} from "react";

export default function App({children}: PropsWithChildren) {
  return (
    <>
      <div className="">
        <main className="">{children}</main>
      </div>
    </>
  );
}
