export const isInteger = (maybeInteger) => (
  Number.isInteger(maybeInteger)
    && maybeInteger > -2147483648 && maybeInteger < 2147483647
);
