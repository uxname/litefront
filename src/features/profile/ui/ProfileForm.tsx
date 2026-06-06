import {
  type ProfileUpdateInput,
  useUpdateProfileMutation,
} from "@generated/graphql";
import { m } from "@generated/paraglide/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/Button";
import { FormField } from "@shared/ui/FormField";
import { Input } from "@shared/ui/Input";
import { Textarea } from "@shared/ui/Textarea";
import { toast } from "@shared/ui/Toaster";
import { ImageUp, User as UserIcon } from "lucide-react";
import { type FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadAvatar } from "../api/upload-avatar";
import { type ProfileFormValues, profileFormSchema } from "../model/schema";

export interface ProfileFormProps {
  profile: {
    avatarUrl: string | null;
    displayName: string | null;
    bio: string | null;
  };
  /** Access token forwarded to the avatar upload request (optional in dev). */
  accessToken?: string;
}

export const ProfileForm: FC<ProfileFormProps> = ({ profile, accessToken }) => {
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={m.profile_avatar()}
            className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
            <UserIcon className="h-7 w-7" />
          </span>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="sm"
            loading={uploading}
            leftIcon={<ImageUp className="h-4 w-4" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading
              ? m.profile_avatar_uploading()
              : m.profile_avatar_upload()}
          </Button>
          <p className="mt-1.5 text-xs text-slate-400">
            {m.profile_avatar_hint()}
          </p>
        </div>
      </div>

      <FormField
        htmlFor="displayName"
        label={m.profile_display_name()}
        error={errors.displayName?.message}
      >
        <Input
          id="displayName"
          invalid={!!errors.displayName}
          aria-describedby="displayName-error"
          placeholder={m.profile_display_name_placeholder()}
          {...register("displayName")}
        />
      </FormField>

      <FormField
        htmlFor="bio"
        label={m.profile_bio()}
        error={errors.bio?.message}
      >
        <Textarea
          id="bio"
          invalid={!!errors.bio}
          aria-describedby="bio-error"
          placeholder={m.profile_bio_placeholder()}
          {...register("bio")}
        />
      </FormField>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isDirty || uploading}
        >
          {m.profile_save()}
        </Button>
      </div>
    </form>
  );
};
