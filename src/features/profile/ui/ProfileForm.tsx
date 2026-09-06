import { m } from "@generated/paraglide/messages";
import { Button } from "@shared/ui/Button";
import { FormField } from "@shared/ui/FormField";
import { Input } from "@shared/ui/Input";
import { Textarea } from "@shared/ui/Textarea";
import { ImageUp, User as UserIcon } from "lucide-react";
import type { FC } from "react";
import { useProfileForm } from "../lib/useProfileForm";

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
  const {
    register,
    errors,
    isDirty,
    isSubmitting,
    uploading,
    avatarUrl,
    fileInputRef,
    handleFileSelect,
    onSubmit,
  } = useProfileForm({ profile, accessToken });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={m.profile_avatar()}
            className="h-16 w-16 shrink-0 rounded-full border border-base-300 object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-200 text-base-content/70">
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
          <p className="mt-1.5 text-xs text-base-content/70">
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
          className="shadow-sm"
          loading={isSubmitting}
          disabled={!isDirty || uploading}
        >
          {m.profile_save()}
        </Button>
      </div>
    </form>
  );
};
