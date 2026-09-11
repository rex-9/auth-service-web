import React, { useState } from "react";
import { AppLocales, useTranslate } from "../../../locales";
import {
  Dialog,
  FormContainer,
  RatingSlider,
  TextArea,
  Button,
} from "../../../design/components";
import { useToast, useLoading } from "../../../contexts";
import FeedbackController from "../feedback.controller";
import { FEEDBACK_RATINGS } from "../constants";

export interface IFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDialog: React.FC<IFeedbackDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslate();
  const { success, error } = useToast();
  const { isLoading, setLoading } = useLoading();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(FEEDBACK_RATINGS.DEFAULT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      error(t(AppLocales.Feedback.ErrorEmpty));
      return;
    }

    try {
      setLoading(true);
      await FeedbackController.submitFeedback({
        content,
        rating,
      });

      success(t(AppLocales.Feedback.SuccessMessage));
      setContent("");
      setRating(FEEDBACK_RATINGS.DEFAULT);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : t(AppLocales.Feedback.ErrorSubmit);
      error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t(AppLocales.Feedback.Title)}
    >
      <FormContainer
        onSubmit={handleSubmit}
        className="p-0 bg-transparent gap-4"
      >
        <RatingSlider
          value={rating}
          onChange={setRating}
          min={FEEDBACK_RATINGS.MIN}
          max={FEEDBACK_RATINGS.MAX}
          label={t(AppLocales.Feedback.RatingLabel)}
          disabled={isLoading}
        />

        <TextArea
          id="feedback-content"
          label={t(AppLocales.Feedback.ContentLabel)}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(AppLocales.Feedback.Placeholder)}
          disabled={isLoading}
          autoExpand={false}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {t(AppLocales.Common.Cancel)}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading || !content.trim()}
          >
            {t(AppLocales.Feedback.Submit)}
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};

export default FeedbackDialog;
