import * as Yup from "yup";

export const channelValidationSchema = Yup.object().shape({
  channelName: Yup.string().required("Channel Name is required"),
  description: Yup.string(),
  isActive: Yup.boolean().required("Is Active is required"),
});

export const territoryValidationSchema = Yup.object().shape({
  territoryName: Yup.string().required("Territory Name is required"),
  region: Yup.string(),
  isActive: Yup.boolean().required("Is Active is required"),
});

export const compensationValidationSchema = Yup.object().shape({
  compensationAmount: Yup.number()
    .required("Compensation Amount is required")
    .typeError("Compensation Amount must be a number"),
  compensationType: Yup.string().required("Compensation Type is required"),
  isActive: Yup.boolean().required("Is Active is required"),
});
