
export function getInitials(firstName:string, lastName:string) {
  let initials = '';

  if (typeof firstName === 'string' && firstName.length > 0) {
    initials += firstName.charAt(0);
  } else {
    console.warn("Warning: firstName is not a valid non-empty string.");
  }

  if (typeof lastName === 'string' && lastName.length > 0) {
    initials += lastName.charAt(0);
  } else {
    console.warn("Warning: lastName is not a valid non-empty string.");
  }

  return initials;
}