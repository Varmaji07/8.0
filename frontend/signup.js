document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signupCard = document.querySelector(".signup-card");

  if (signupForm) {
    // Initial entry animation
    signupCard.classList.add("shake");
    setTimeout(() => signupCard.classList.remove("shake"), 500);

    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("signupUsername").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();

      if (name.length < 3) {
        showError("Username must be at least 3 characters long.");
        return;
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        showError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        showError("Password must be at least 6 characters long.");
        return;
      }

      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "CREATING ACCOUNT...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("/user/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.status === "SUCCESS") {
          alert("✅ Signup successful! Welcome to SkillBridge.");
          window.location.href = "login.html";
        } else {
          showError("❌ Signup Failed: " + data.message);
        }
      } catch (err) {
        console.error("Signup error:", err);
        showError("⚠️ Network Error: Could not connect to the server.");
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  function showError(msg) {
    alert(msg);
    signupCard.classList.add("shake");
    setTimeout(() => signupCard.classList.remove("shake"), 500);
  }
});
