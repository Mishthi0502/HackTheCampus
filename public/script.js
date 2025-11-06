const form = document.getElementById("issueForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    message.textContent = result.message || result.error;
    form.reset();
  } catch (err) {
    message.textContent = "Error submitting the issue.";
    console.error(err);
  }
});
