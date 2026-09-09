import React from "react";
import { useNavigate } from "react-router-dom";
import { iconsLib } from "../../../assets";
import { Button } from "../../../design";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import { AppLocales, useTranslate } from "../../../locales";
import {
  Breadcrumbs,
  PageHeader,
  type IBreadcrumbItem,
} from "../../../design/components/common";

export interface IAdminDetailHeaderProps {
  breadcrumbs: IBreadcrumbItem[];
  title: React.ReactNode;
  description?: React.ReactNode;
  backTo: string;
  backLabel?: React.ReactNode;
  action?: React.ReactNode;
}

export const AdminDetailHeader: React.FC<IAdminDetailHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  backTo,
  backLabel,
  action,
}) => {
  const navigate = useNavigate();
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} className="min-w-0 flex-1" />
        <Button
          size={ButtonSizes.SM}
          variant={ButtonVariants.SECONDARY}
          className="shrink-0"
          onClick={() => navigate(backTo)}
        >
          <iconsLib.arrowLeft className="mr-1.5 h-4 w-4" />
          {backLabel ?? t(AppLocales.Admin.Common.Actions.Back)}
        </Button>
      </div>
      <PageHeader title={title} description={description} action={action} />
    </div>
  );
};
