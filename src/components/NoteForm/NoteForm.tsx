import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = async (values: NoteFormValues) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.formGroup}>
            Title
            <Field
              className={css.input}
              type="text"
              name="title"
              placeholder="Enter note title"
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </label>

          <label className={css.formGroup}>
            Content
            <Field
              as="textarea"
              className={css.textarea}
              name="content"
              rows={5}
              placeholder="Enter note content"
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </label>

          <label className={css.formGroup}>
            Tag
            <Field as="select" className={css.select} name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </label>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;
