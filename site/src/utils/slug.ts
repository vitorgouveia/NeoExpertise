export const slugify = (string: string, separator: string | undefined = '-') =>
  string.toLowerCase().split(' ').join(separator)
