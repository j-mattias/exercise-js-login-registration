setup();

function setup() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("Current storage: ", users);

  checkPasswordLength(8);
  validateRegistration(users);
  validateLogin(users);
}

// Function to validate user login information
function validateLogin(users) {
  const loginFormRef = document.querySelector("#loginForm");

  loginFormRef.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = e.target.loginUsername.value;
    const password = e.target.loginPassword.value;

    try {
      if (!isValidInputs()) {
        throw new Error("Please fill out all fields");
      } else if (users.some((user) => user.username === username)) {
        // Get the user with the given username
        const user = users.find((user) => user.username === username);

        // If credentials check out, hide the login form and greet the user
        if (user.password === password) {
          loginFormRef.classList.toggle("hidden");
          document.querySelector("#alert").textContent = `Welcome ${user.name}`;
        } else {
          throw new Error("Incorrect password");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      document.querySelector("#alert").textContent = error.message;
    }
  });
}

// Function to validate user registration before adding a new user
function validateRegistration(users) {
  const registrationFormRef = document.querySelector("#regForm");

  registrationFormRef.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.regName.value;
    const username = e.target.regUsername.value;
    const email = e.target.regEmail.value;
    const password1 = e.target.regPassword1.value;
    const password2 = e.target.regPassword2.value;

    try {
      if (!isValidInputs()) {
        throw new Error("Please fill out all fields");
      } else if (!isValidName(name)) {
        throw new Error(`Please provide a name in "First Last" format`);
      } else if (users.some((user) => user.username === username)) {
        throw new Error("Username already exists");
      } else if (users.some((user) => user.email === email)) {
        throw new Error("Email is taken");
      } else if (password1 !== password2) {
        throw new Error("Passwords do not match");
      } else if (password1.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      } else {
        const user = {
          name: formatName(name),
          username,
          email,
          password: password1,
        };

        // Add user to the users list
        users.push(user);
        console.log("Added:", user);

        // Update localStorage to reflect the new list
        localStorage.setItem("users", JSON.stringify(users));

        // Hide register form and display login form
        registrationFormRef.classList.toggle("hidden");
        document.querySelector("#loginForm").classList.toggle("hidden");

        clearAlert();
      }
    } catch (error) {
      document.querySelector("#alert").textContent = error.message;
    }
  });
}

// Function for checking for empty fields
function isValidInputs() {
  const inputs = document.querySelectorAll("input");
  for (const input of inputs) {
    if (!input.parentElement.classList.contains("hidden")) {
      if (input.value === "") {
        return false;
      }
    }
  }
  return true;
}

// Function to clear alert
function clearAlert() {
  document.querySelector("#alert").textContent = "";
}

// Function to indicate that password is below desired length
function checkPasswordLength(length) {
  const loginInputs = document.querySelectorAll("input[type='password']");

  loginInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.length < length && input.value.length > 0) {
        input.style.backgroundColor = "#f49797";
      } else {
        input.style.backgroundColor = "";
      }
    });
  });
}

// Validate that name is two names separated by a space
function isValidName(name) {
  const names = name.trim().split(" ");
  if (names.length !== 2) {
    return false;
  }
  return true;
}

// Format names to capital case
function formatName(name) {
  const splitName = name.trim().split(" ");
  [first, last] = [splitName[0].toLowerCase(), splitName[1].toLowerCase()];

  const formattedName = first[0].toUpperCase() + first.slice(1) + " " + last[0].toUpperCase() + last.slice(1);
  return formattedName;
}
