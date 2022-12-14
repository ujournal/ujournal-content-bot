module.exports = async ({ getDomByHtml, getHtmlByUrl, convEncoding, url }) => {
  const targetUrl = "https://www.epravda.com.ua";

  const { window } = getDomByHtml(
    convEncoding(
      await getHtmlByUrl(targetUrl, {
        responseEncoding: "binary",
      })
    )
  );

  const targetUrlParsed = url.parse(targetUrl);
  const baseUrl = `${targetUrlParsed.protocol}//${targetUrlParsed.host}`;

  const result = [];

  Array.from(window.document.querySelectorAll(".news > *")).forEach((child) => {
    if (
      child.classList.contains("article") &&
      child.querySelector(".article__time")
    ) {
      const important = child.classList.contains("article_bold");
      const anchor = child.querySelector("a");
      const [, , year, month, day] = anchor.href
        .replace("https://www.pravda.com.ua", "")
        .split("/");

      result.push({
        title: (
          anchor.querySelector("[data-vr-headline]") || anchor
        ).textContent.trim(),
        url: anchor.href.startsWith("http")
          ? anchor.href
          : `${baseUrl}${anchor.href}`,
        time: child.querySelector(".article__time")?.textContent.trim() || null,
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        important,
      });
    }
  });

  return result;
};
