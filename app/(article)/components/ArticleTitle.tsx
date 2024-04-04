import debounce from "lodash.debounce";
import React from "react";

interface IArticleTitleProps {
  titleRef: React.MutableRefObject<HTMLInputElement | null>;
  defaultValue: string;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPublishDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ArticleTitle({
  titleRef,
  defaultValue,
  setIsSaveDisabled,
  setIsPublishDisabled,
}: IArticleTitleProps) {
  const debounceChange = debounce(() => {
    setIsSaveDisabled(false);
  }, 3000);

  const handleChange = () => {
    setIsSaveDisabled(true);
    setIsPublishDisabled(true);

    debounceChange();
  };

  return (
    <div className="w-full py-2 transition-colors border-b focus-within:border-slate-300 text-3xl">
      <input
        type="text"
        placeholder="Blog Title"
        className=" w-full outline-0 border-0"
        defaultValue={defaultValue}
        ref={titleRef}
        maxLength={100}
        onChange={handleChange}
      />
    </div>
  );
}
