"use client";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/helpers/ApiError";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newData = {
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      setIsPending(true);

      const res = await api.post("/user/change-password", newData);

      const data = await res.data;

      toast.success(data.message);

      const resetForm = document.getElementById(
        "passwordForm"
      ) as HTMLFormElement;
      resetForm.reset();
    } catch (error) {
      toast.error(ApiError.generate(error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={handleSubmit}
      id="passwordForm"
    >
      <h5>Change Password</h5>

      <Input
        type="password"
        placeholder="New password"
        name="newPassword"
        disabled={isPending}
        className="!w-[280px]"
      />
      <Input
        type="password"
        placeholder="Confirm password"
        name="confirmPassword"
        disabled={isPending}
        className="!w-[280px]"
      />

      <Button type="submit" disabled={isPending} className="w-fit">
        Submit
      </Button>
    </form>
  );
}
