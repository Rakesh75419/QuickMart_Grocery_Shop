// ================= LOADER =================
function showLoader() {
  const loaderContainer = document.getElementById("loaderContainer");
  const mainContent = document.getElementById("mainContent");

  if (loaderContainer && mainContent) {
    loaderContainer.style.display = "flex";
    mainContent.style.display = "none";
  }
}

function hideLoader() {
  const loaderContainer = document.getElementById("loaderContainer");
  const mainContent = document.getElementById("mainContent");

  if (loaderContainer && mainContent) {
    loaderContainer.style.display = "none";
    mainContent.style.display = "block";
  }
}

window.addEventListener("load", () => {
  showLoader();
  setTimeout(hideLoader, 2000);
});

// ================= FORM TOGGLE =================
function showLoginForm() {
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("signupContainer").style.display = "none";
}

function showSignupForm() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "block";
}

function generateShortId() {
  return String(Date.now() + Math.floor(Math.random() * 1000));
}

// ================= MAIN =================
window.addEventListener("DOMContentLoaded", () => {
  showLoginForm();

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const signupLink = document.getElementById("signupLink");
  const loginLink = document.getElementById("loginLink");

  // ================= LOGIN =================
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = loginForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const email = document.getElementById("email").value
      .trim()
      .toLowerCase();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("http://localhost:5000/users");
      if (!res.ok) throw new Error("GET users failed");

      const users = await res.json();
      const user = users.find((u) => u.email === email);

      if (!user) {
        alert("Email not registered!");
        submitBtn.disabled = false;
        return;
      }

      if (user.password !== password) {
        alert("Wrong password!");
        submitBtn.disabled = false;
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "./src/Home/home.html";
    } catch (err) {
      console.error(err);
      alert("Login failed!");
      submitBtn.disabled = false;
    }
  });

  // ================= SIGNUP =================
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value
      .trim()
      .toLowerCase();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document
      .getElementById("signup-confirm")
      .value.trim();

    if (!fullname || !email || !password) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password does not match!");
      return;
    }

    try {
      // check existing users
      const checkRes = await fetch("http://localhost:5000/users");
      if (!checkRes.ok) throw new Error("GET users failed");

      const users = await checkRes.json();
      const userExists = users.find((u) => u.email === email);

      if (userExists) {
        alert("User already exists!");
        return;
      }

      // create user
      const createRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: generateShortId(),
          fullname,
          email,
          password,
          createdAt: new Date().toLocaleString(),
        }),
      });

      if (!createRes.ok) throw new Error("POST user failed");

      alert("Account created successfully! Please login.");
      signupForm.reset();
      showLoginForm();
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed!");
    }
  });

  // ================= LINKS =================
  signupLink.addEventListener("click", () => showSignupForm());
  loginLink.addEventListener("click", () => showLoginForm());
});
