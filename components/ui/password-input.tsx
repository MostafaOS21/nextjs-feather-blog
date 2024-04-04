"use client";

import { EyeIcon, EyeOff } from "lucide-react";
import { Input, InputProps } from "./input";
import React from "react";

export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPassword = () => setShowPassword((value) => !value);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      suffix={
        showPassword ? (
          <EyeOff className="cursor-pointer" onClick={handleShowPassword} />
        ) : (
          <EyeIcon className="cursor-pointer" onClick={handleShowPassword} />
        )
      }
    />
  );
};
