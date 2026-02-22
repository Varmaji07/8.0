const loginForm = document.getElementById("loginForm");
const loginCard = document.querySelector(".login-card");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showError("Please enter valid credentials.");
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "LOGGING IN...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/user/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        localStorage.setItem("loggedInUser", JSON.stringify(data.data));
        window.location.href = "index.html";
      } else {
        showError("❌ Login Failed: " + data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("⚠️ Network Error: Could not connect to the server.");
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function showError(msg) {
  alert(msg);
  if (loginCard) {
    loginCard.classList.add("shake");
    setTimeout(() => loginCard.classList.remove("shake"), 500);
  }
}

