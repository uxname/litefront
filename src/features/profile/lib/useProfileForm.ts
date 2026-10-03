import {
  type ProfileUpdateInput,
  UpdateProfileDocument,
} from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { logError } from "@shared/lib/logger";
import { toast } from "@shared/ui/sonner";
import { useBlocker } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { uploadAvatar } from "../api/upload-avatar";
import { type ProfileFormValues, profileFormSchema } from "../model/schema";
import type { ProfileFormProps } from "../ui/ProfileForm";

// Client-side guards mirroring the backend upload allowlist (image/* up to 5 MB).
// They give immediate feedback and avoid a pointless round-trip; the server
// remains the trust boundary.
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

/**
 * Form logic for {@link ProfileForm}: react-hook-form setup, the avatar
 * upload handler (with its uploading state) and the dirty-field-diffed submit
 * that calls `updateProfile` and toasts the outcome. Kept separate so the
 * component is a pure render of this hook's return value.
 */
export const useProfileForm = ({ profile, accessToken }: ProfileFormProps) => {
  const [, updateProfile] = useMutation(UpdateProfileDocument);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string>();
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

    // A rejected file is the user's to fix, so the reason sits under the
    // control instead of in a toast that disappears.
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError(m.profile_avatar_invalid_type());
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError(m.profile_avatar_too_large());
      return;
    }

    setAvatarError(undefined);
    setUploading(true);
    try {
      const url = await uploadAvatar(file, accessToken);
      setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      // The upload is a plain fetch, not a urql operation, so nothing else
      // reports it — without this the user got a toast and the log got nothing.
      logError("avatar_upload_failed", error);
      toast.error(m.profile_avatar_upload_error());
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    // Only changed fields go out (omitted = unchanged on the backend). A field
    // the user emptied goes out as "" — that is how it gets cleared.
    const input: ProfileUpdateInput = {};
    if (dirtyFields.displayName) {
      input.displayName = values.displayName?.trim() ?? "";
    }
    if (dirtyFields.bio) {
      input.bio = values.bio?.trim() ?? "";
    }
    if (dirtyFields.avatarUrl) {
      input.avatarUrl = values.avatarUrl?.trim() ?? "";
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

  // Leaving with unsaved edits asks first — in-app navigation through the
  // router, a reload or a closed tab through the browser's own prompt.
  useBlocker({
    shouldBlockFn: () => !window.confirm(m.profile_unsaved_confirm()),
    enableBeforeUnload: isDirty,
    disabled: !isDirty,
  });

  return {
    register,
    errors,
    isDirty,
    isSubmitting,
    uploading,
    avatarError,
    avatarUrl,
    avatarPending: !!dirtyFields.avatarUrl,
    fileInputRef,
    handleFileSelect,
    onSubmit,
  };
};
