// TW Elements is free under AGPL, with commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com 
"use client";
import { useEffect } from "react";

const MyAnim = () => {
  useEffect(() => {
    const init = async () => {
      const { Animate, initTE } = await import("tw-elements");
      initTE({ Animate });
    };
    init();
  }, []);

  return (
<div>
<div
  data-te-animation-init
  data-te-animation-start="onHover"
  data-te-animation-reset="true"
  data-te-animation="[drop-in_0.5s]"
  className="m-[20px] h-[130px] w-[130px] origin-[top_center] bg-[#fbfbfb] pt-10 text-center shadow-[0_2px_10px_0_rgba(0,0,0,0.14)] dark:bg-neutral-600">
  drop in
</div>

<div
  data-te-animation-init
  data-te-animation-start="onHover"
  data-te-animation-reset="true"
  data-te-animation="[fly-in_0.5s]"
  className="m-[20px] h-[130px] w-[130px] bg-[#fbfbfb] pt-10 text-center shadow-[0_2px_10px_0_rgba(0,0,0,0.14)] dark:bg-neutral-600">
  fly-in
</div>

<div
  data-te-animation-init
  data-te-animation-start="onHover"
  data-te-animation-reset="true"
  data-te-animation="[fly-out_0.5s]"
  className="m-[20px] h-[130px] w-[130px] bg-[#fbfbfb] pt-10 text-center shadow-[0_2px_10px_0_rgba(0,0,0,0.14)] dark:bg-neutral-600">
  fly-out
</div>
</div>
  );
};

export default MyAnim;