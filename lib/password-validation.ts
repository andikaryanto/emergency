export const PASSWORD_NO_SPACE_PATTERN = /^\S+$/;
export const PASSWORD_HAS_NUMBER_PATTERN = /\d/;
export const PASSWORD_HAS_SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return "Gunakan minimal 8 karakter.";
  }

  if (!PASSWORD_NO_SPACE_PATTERN.test(password)) {
    return "Hapus spasi pada password Anda.";
  }

  if (!PASSWORD_HAS_NUMBER_PATTERN.test(password)) {
    return "Tambahkan minimal 1 angka.";
  }

  if (!PASSWORD_HAS_SPECIAL_CHAR_PATTERN.test(password)) {
    return "Tambahkan minimal 1 karakter selain huruf dan angka.";
  }

  return null;
}
