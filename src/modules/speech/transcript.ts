export function joinTranscript(left: string, right: string): string {
  const next = right.trim();
  if (!next) {
    return left;
  }
  if (!left) {
    return next;
  }
  if (left.endsWith(" ") || left.endsWith("\n")) {
    return left + next;
  }
  return `${left} ${next}`;
}

export function mergePartial(current: string, incoming: string): string {
  if (!incoming) {
    return current;
  }
  if (!current) {
    return incoming;
  }

  const currentLower = current.toLowerCase();
  const incomingLower = incoming.toLowerCase();
  if (
    incomingLower.startsWith(currentLower) ||
    currentLower.startsWith(incomingLower)
  ) {
    return incoming;
  }

  return joinTranscript(current, incoming);
}
