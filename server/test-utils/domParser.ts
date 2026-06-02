export const parseHtml = async (html: string) => {
  const { JSDOM } = await import('jsdom');
  return new JSDOM(html).window.document;
};
