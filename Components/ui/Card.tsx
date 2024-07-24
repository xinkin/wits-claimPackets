import Image from "next/image";
import React from "react";
import { UserPacket } from "../../hooks/useMerkleTree";

const Card = ({ data }: { data: UserPacket }) => {
  return (
    <div
      className={`relative w-full max-w-[250px] bg-dark/30  p-4 rounded-xl space-y-2 `}
    >
      <div className="relative w-full h-80 rounded-xl overflow-hidden">
        <Image
          src={`/images/pack${data?.request?.id}.png`}
          alt={`pack ${data?.request?.id}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
        {data.isClaimed ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52">
            <picture>
              <img
                src="/images/claimed.png"
                alt="Claimed"
                className="h-52 w-52 aspect-square drop-shadow-lg shadow-mikado-50"
              />
            </picture>
          </div>
        ) : null}
      </div>
      <h3 className="font-beaufort">
        #{data?.request?.id} - WITS: Quill and Ink
      </h3>
      <p className="text-mikado-500/70 font-lato">
        Claimable amount : {data?.request?.amount}
      </p>
    </div>
  );
};

export default Card;
