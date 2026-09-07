// src/modules/user/pages/UserPage.tsx
import React, { useEffect, useState } from "react";
import { iconsLib } from "../../../assets";
import {
  AlertDialog,
  Button,
  FileInput,
  FormContainer,
  ProfileAvatar,
  TextInput,
} from "../../../design";
import {
  ButtonTypes,
  ButtonVariants,
  ComponentSizes,
} from "../../../design/constants";
import { useAuth, useLoading, useToast } from "../../../contexts";
import { AppLocales, useTranslate } from "../../../locales";
import UserController from "../user.controller";

const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export const UserPage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const t = useTranslate();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [username, setUsername] = useState(currentUser?.username ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(
    currentUser?.avatar_url ?? null,
  );
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setName(currentUser?.name ?? "");
    setUsername(currentUser?.username ?? "");
  }, [currentUser?.id, currentUser?.name, currentUser?.username]);

  useEffect(() => {
    if (selectedFile) return;
    setPreviewSrc(currentUser?.avatar_url ?? null);
  }, [currentUser?.avatar_url, selectedFile]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleUsernameChange = (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      setAlertMessage(t(AppLocales.Auth.SignUpInfo.FullNameRequired));
      return;
    }
    if (!username || username.length < 3) {
      setAlertMessage(t(AppLocales.Auth.SignUpInfo.UsernameLength));
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      setAlertMessage(t(AppLocales.Auth.SignUpInfo.UsernameFormat));
      return;
    }

    setLoading(true, { overlay: false });

    let uploadedAvatarUrl: string | null = null;

    if (selectedFile) {
      const uploadResult = await UserController.uploadImage(selectedFile, {
        type: "avatar",
        assetable_type: "User",
        assetable_id: currentUser?.id,
      });

      uploadedAvatarUrl = uploadResult?.asset?.url ?? null;
      if (!uploadedAvatarUrl) {
        setLoading(false, { overlay: false });
        setAlertMessage(t(AppLocales.User.Errors.UploadAvatar));
        return;
      }
    }

    const result = await UserController.updateCurrentUser({
      name: name.trim(),
      username,
    });

    setLoading(false, { overlay: false });

    if (!result.success || !result.user) {
      setAlertMessage(
        result.error || t(AppLocales.User.Errors.Update),
      );
      return;
    }

    setCurrentUser({
      ...currentUser,
      ...result.user,
      avatar_url: result.user.avatar_url || uploadedAvatarUrl || currentUser?.avatar_url,
    });
    setSelectedFile(null);
    toast.success(
      result.message || t(AppLocales.User.Toasts.UpdateSuccess),
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <div className="space-y-6 rounded-2xl border border-base-300 bg-base-100/70 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-5">
          <div className="relative w-fit shrink-0">
            <ProfileAvatar
              src={previewSrc}
              alt={name || username || currentUser?.email}
              size={ComponentSizes.XL}
              onClick={() => undefined}
            />
            <div className="absolute -bottom-1 -right-1">
              <FileInput
                accept="image/*"
                fullWidth={false}
                disabled={isLoading}
                onChange={setSelectedFile}
                trigger={
                  <Button
                    type={ButtonTypes.BUTTON}
                    variant={ButtonVariants.SECONDARY}
                    size={ComponentSizes.SM}
                    className="h-8 w-8 rounded-full p-0"
                    aria-label={t(AppLocales.User.EditAvatar)}
                    disabled={isLoading}
                  >
                    <iconsLib.pencilSquare className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>
          <div>
            <h1 className="font-primary text-2xl font-bold text-base-content">
              {name ||
                username ||
                t(AppLocales.User.Profile)}
            </h1>
            <p className="text-body-m text-base-content/70">
              {currentUser?.email}
            </p>
          </div>
        </div>
        <p className="text-body-s text-base-content/70">
          {t(AppLocales.User.AvatarHint)}
        </p>

        <FormContainer
          onSubmit={handleSubmit}
          className="w-full max-w-none space-y-4 bg-transparent p-0 shadow-none"
        >
          <TextInput
            id="profile-name"
            label={t(AppLocales.Auth.SignUpInfo.FullNameLabel)}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t(AppLocales.Auth.SignUpInfo.FullNamePlaceholder)}
            helperText={t(AppLocales.Auth.SignUpInfo.FullNameHelper)}
            required
            fullWidth
            disabled={isLoading}
          />
          <TextInput
            id="profile-username"
            label={t(AppLocales.Auth.SignUpInfo.UsernameLabel)}
            type="text"
            value={username}
            onChange={(event) => handleUsernameChange(event.target.value)}
            placeholder={t(AppLocales.Auth.SignUpInfo.UsernamePlaceholder)}
            helperText={t(AppLocales.Auth.SignUpInfo.UsernameHelper)}
            required
            fullWidth
            disabled={isLoading}
          />
          <TextInput
            id="profile-email"
            label={t(AppLocales.User.EmailLabel)}
            type="email"
            value={currentUser?.email ?? ""}
            helperText={t(AppLocales.User.EmailHelper)}
            disabled
            fullWidth
          />
          <Button
            type={ButtonTypes.SUBMIT}
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.MD}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {t(AppLocales.Common.Save)}
          </Button>
        </FormContainer>
      </div>
    </div>
  );
};

export default UserPage;
