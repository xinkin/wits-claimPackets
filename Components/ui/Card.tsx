import Image from "next/image";
import React from "react";
import { UserPacket } from "../../hooks/useMerkleTree";

const Card = ({ data }: { data: UserPacket }) => {
  return (
    <div className="w-full w-[250px] bg-dark/30  p-4 rounded-xl space-y-2">
      <div className="relative w-full h-80 rounded-xl overflow-hidden">
        <Image
          src={`/images/pack${data?.id}.png`}
          alt={`pack ${data?.id}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <h3>#{data?.id} - WITS: Quill and Ink</h3>
      <p className="text-mikado-500/70">Claimable amount : {data?.amount}</p>
    </div>
  );
};

export default Card;
