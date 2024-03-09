import Image from "next/image";
import React from "react";
import { UserPacket } from "../../hooks/useMerkleTree";

const Card = ({
  data,
  isSelected,
  onSelect,
}: {
  data: UserPacket;
  isSelected: boolean;
  onSelect: (data: UserPacket) => void;
}) => {
  const handleSelection = () => {
    onSelect(data);
  };
  return (
    <div
      onClick={handleSelection}
      className={`w-full max-w-[250px] bg-dark/30  p-4 rounded-xl space-y-2 ${
        isSelected ? "border border-mikado-50/30" : null
      }`}
    >
      <div className="relative w-full h-80 rounded-xl overflow-hidden">
        <Image
          src={`/images/pack${data?.request?.id}.png`}
          alt={`pack ${data?.request?.id}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <h3>#{data?.request?.id} - WITS: Quill and Ink</h3>
      <p className="text-mikado-500/70">
        Claimable amount : {data?.request?.amount}
      </p>
    </div>
  );
};

export default Card;
