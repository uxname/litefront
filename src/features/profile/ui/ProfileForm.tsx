import { m } from "@generated/paraglide/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/ui/field";
import { Input } from "@shared/ui/input";
import { Spinner } from "@shared/ui/spinner";
import { Textarea } from "@shared/ui/textarea";
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
    avatarError,
    avatarUrl,
    avatarPending,
    fileInputRef,
    handleFileSelect,
    onSubmit,
  } = useProfileForm({ profile, accessToken });

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field orientation="horizontal" data-invalid={!!avatarError}>
          <Avatar className="size-16 border">
            <AvatarImage
              src={avatarUrl || undefined}
              alt={m.profile_avatar()}
            />
            <AvatarFallback>
              <UserIcon className="size-7 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <input
              ref={fileInputRef}
              id="avatar"
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={uploading}
              aria-describedby="avatar-hint"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Spinner /> : <ImageUp />}
              {uploading
                ? m.profile_avatar_uploading()
                : m.profile_avatar_upload()}
            </Button>
            {avatarError ? (
              <FieldError id="avatar-hint">{avatarError}</FieldError>
            ) : (
              <FieldDescription id="avatar-hint">
                {avatarPending
                  ? m.profile_avatar_pending()
                  : m.profile_avatar_hint()}
              </FieldDescription>
            )}
          </div>
        </Field>

        <Field data-invalid={!!errors.displayName}>
          <FieldLabel htmlFor="displayName">
            {m.profile_display_name()}
          </FieldLabel>
          <Input
            id="displayName"
            aria-invalid={!!errors.displayName}
            aria-describedby={
              errors.displayName ? "displayName-error" : undefined
            }
            placeholder={m.profile_display_name_placeholder()}
            {...register("displayName")}
          />
          <FieldError id="displayName-error">
            {errors.displayName?.message}
          </FieldError>
        </Field>

        <Field data-invalid={!!errors.bio}>
          <FieldLabel htmlFor="bio">{m.profile_bio()}</FieldLabel>
          <Textarea
            id="bio"
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            placeholder={m.profile_bio_placeholder()}
            {...register("bio")}
          />
          <FieldError id="bio-error">{errors.bio?.message}</FieldError>
        </Field>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="shadow-sm"
            disabled={!isDirty || uploading || isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {m.profile_save()}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
