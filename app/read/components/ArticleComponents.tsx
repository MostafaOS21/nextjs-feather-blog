import Image from "next/image";

// Banner
export function Banner({ banner }: { banner: string }) {
  return (
    <div className="w-full h-[280px] lg:h-[450px]">
      <Image
        src={banner}
        width={900}
        height={900}
        alt="Banner"
        className="w-full h-full"
      />
    </div>
  );
}
