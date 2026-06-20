import {
  type ProfileUpdateInput,
  useUpdateProfileMutation,
} from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@shared/ui/Toaster";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadAvatar } from "../api/upload-avatar";
import { type ProfileFormValues, profileFormSchema } from "../model/schema";
import type { ProfileFormProps } from "../ui/ProfileForm";

/**
 * Form logic for {@link ProfileForm}: react-hook-form setup, the avatar
 * upload handler (with its uploading state) and the dirty-field-diffed submit
 * that calls `updateProfile` and toasts the outcome. Kept separate so the
 * component is a pure render of this hook's return value.
 */
export const useProfileForm = ({ profile, accessToken }: ProfileFormProps) => {
  const [, updateProfile] = useUpdateProfileMutation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onBlur",
    defaultValues: {
      displayName: profile.displayName ?? "",
      bio: profile.bio ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    },
  });

  const avatarUrl = watch("avatarUrl");

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadAvatar(file, accessToken);
      setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
    } catch {
      toast.error(m.profile_avatar_upload_error());
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const input: ProfileUpdateInput = {};
    if (dirtyFields.displayName && values.displayName?.trim()) {
      input.displayName = values.displayName.trim();
    }
    if (dirtyFields.bio) {
      input.bio = values.bio?.trim() ?? "";
    }
    if (dirtyFields.avatarUrl && values.avatarUrl?.trim()) {
      input.avatarUrl = values.avatarUrl.trim();
    }

    if (Object.keys(input).length === 0) return;

    const result = await updateProfile({ input });
    if (result.error) {
      toast.error(m.profile_save_error());
      return;
    }
    toast.success(m.profile_saved());
    reset(values); // clear dirty state, keep current values
  });

  return {
    register,
    errors,
    isDirty,
    isSubmitting,
    uploading,
    avatarUrl,
    fileInputRef,
    handleFileSelect,
    onSubmit,
  };
};
