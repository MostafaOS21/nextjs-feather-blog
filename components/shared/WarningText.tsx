import React from "react";

export default function WarningText({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center gap-3 w-full !text-[14px] text-gray-600 bg-gray-100 py-2 my-3 font-medium rounded-full">
      <p>{message}</p>
    </div>
  );
}
