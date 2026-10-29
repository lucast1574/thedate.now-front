export function weddingContent(value: string) {
  return /(?:^|[^\p{L}])(?:bodas?|casamiento|matrimonio|wedding|nos\s+casamos)(?:$|[^\p{L}])/iu.test(
    value,
  );
}
