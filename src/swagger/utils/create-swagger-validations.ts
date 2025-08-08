export const createSwaggerValidations = (
  validations: string[],
): { [v: string]: string } => {
  const swaggerValidations: { [key: string]: string } = {};

  let i = 1;
  for (const validation of validations) {
    swaggerValidations[`validation ${i}`] = validation;
    i += 1;
  }

  return swaggerValidations;
};
