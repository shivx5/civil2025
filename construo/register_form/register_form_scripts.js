//document.addEventListener("DOMContentLoaded", function () {
const form = document.querySelector("form");
const messageDiv = document.createElement("div");
messageDiv.id = "success-message";
messageDiv.className = "hidden mb-4 p-4 rounded";
form.parentNode.insertBefore(messageDiv, form);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);
  const paymentSlip = formData.get("payment_slip");
  const uploadData = new FormData();

  // Add text fields
  uploadData.append("name", formData.get("name"));
  uploadData.append("email", formData.get("email"));
  uploadData.append("phone", formData.get("phone"));
  uploadData.append("college", formData.get("college"));
  uploadData.append("year", formData.get("year"));
  formData
    .getAll("technical_event")
    .forEach((event) => uploadData.append("technicalEvents", event));
  formData
    .getAll("non_technical_event")
    .forEach((event) => uploadData.append("nonTechnicalEvents", event));

  // Add file
  uploadData.append("paymentSlip", paymentSlip);

  fetch("http://localhost:5001/submit-form", {
    method: "POST",
    body: uploadData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        showMessage(`Error: ${data.error}\nDetails: ${data.details}`, "error");
      } else {
        showMessage(data.message, "success");
        form.reset();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to send form data. Please try again.");
    });
});

function showMessage(message, type) {
  messageDiv.textContent = message;
  messageDiv.className = `mb-4 p-4 rounded ${
    type === "error"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-green-100 border-green-400 text-green-700"
  }`;
  messageDiv.classList.remove("hidden");
  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 5000);
}
