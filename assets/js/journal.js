async function loadJournal() {
  const listEl = document.getElementById("journal-list");
  if (!listEl) return;

  try {
    const res = await fetch("journal/posts.json");
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      listEl.innerHTML = "<p style='color:var(--muted);'>No entries yet.</p>";
      return;
    }

    posts
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .forEach((post) => {
        const card = document.createElement("article");
        card.className = "journal-card";
        card.addEventListener("click", () => {
          window.location.href = `journal/posts/${post.slug}.html`;
        });

        const left = document.createElement("div");
        left.innerHTML = `
          <h3 style="margin:0 0 0.25rem 0;">${post.title}</h3>
          <div class="journal-card-meta">${post.date}</div>
          <p style="margin:0.25rem 0 0;color:var(--muted);">${post.summary || ""}</p>
        `;

        const right = document.createElement("div");
        right.className = "journal-card-meta";
        right.textContent = post.videoUrl ? "🎥 Video" : "";

        card.appendChild(left);
        card.appendChild(right);
        listEl.appendChild(card);
      });
  } catch (e) {
    listEl.innerHTML =
      "<p style='color:var(--muted);'>Could not load entries. Check posts.json.</p>";
  }
}

function setupJournalForm() {
  const btn = document.getElementById("journal-add-btn");
  const section = document.getElementById("journal-form-section");
  const form = document.getElementById("journal-form");
  const output = document.getElementById("journal-output");

  if (!btn || !section || !form || !output) return;

  btn.addEventListener("click", () => {
    section.style.display = section.style.display === "none" ? "block" : "none";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("journal-date").value;
    const title = document.getElementById("journal-title").value.trim();
    const summary = document.getElementById("journal-summary").value.trim();
    const videoUrl = document.getElementById("journal-video-url").value.trim();
    const slug = document.getElementById("journal-slug").value.trim();
    const body = document.getElementById("journal-body").value;

    if (!date || !title || !slug) {
      alert("Date, title, and slug are required.");
      return;
    }

    const postJson = {
      id: slug,
      date,
      title,
      summary,
      videoUrl: videoUrl || "",
      slug
    };

    const postsJsonSnippet =
      "// Append this object to journal/posts.json array:\n" +
      JSON.stringify(postJson, null, 2);

    const videoTag = videoUrl
      ? `
  <section style="margin:1.5rem 0;">
    <video controls style="width:100%;max-width:720px;border-radius:12px;">
      <source src="${videoUrl}" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </section>`
      : "";

    const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} | Journal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="../../journal.html" style="text-decoration:none;color:inherit;">
        <h1 class="site-title">Journal</h1>
      </a>
      <p class="site-tagline">${date}</p>
    </div>
  </header>
  <main class="container">
    <article>
      <h2>${title}</h2>
      ${videoTag}
      <section>
        <pre style="white-space:pre-wrap;font-family:inherit;">
${body}
        </pre>
      </section>
    </article>
  </main>
</body>
</html>`;

    output.textContent =
      postsJsonSnippet +
      "\n\n// Create file: journal/posts/" +
      slug +
      ".html with the following contents:\n\n" +
      htmlPage;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadJournal();
  setupJournalForm();
});