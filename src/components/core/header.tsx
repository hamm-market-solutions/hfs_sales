import Image from "next/image";

import { siteConfig } from "@/config/site";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex felx-col p-4 bg-hf">
      <div className="flex flex-row w-screen place-content-between">
        <div className="flex flex-row gap-10">
          <Image alt="logo" height={90} src={"/assets/hamm.png"} width={90} />
          <h1 className="text-2xl self-center text-white font-normal">
            {siteConfig.name}
          </h1>
        </div>
        {children}
      </div>
    </header>
  );
}
