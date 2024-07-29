import React from "react";

const Screen = ({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="w-full lg:min-w-96 flex flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-lg font-beaufort uppercase font-semibold uppercase">{title}</h2>
      <p className="text-mikado-50/60 font-lato">{desc}</p>
      {children}
    </div>
  );
};

export default Screen;
