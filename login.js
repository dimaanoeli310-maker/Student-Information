
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const showPassword = document.getElementById("showPassword");
const passwordInput = document.getElementById("password");



if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "index.html";
}



showPassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        showPassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        showPassword.textContent = "Show";

    }

});



loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;


    try {

        const response = await fetch("users.json");

        if (!response.ok) {
            throw new Error("Unable to load users.");
        }

        const users = await response.json();


        const user = users.find(function (account) {

            return (
                account.username === username &&
                account.password === password
            );

        });


        if (user) {

            
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", user.username);
            localStorage.setItem("role", user.role);

            loginMessage.style.color = "green";
            loginMessage.textContent =
                "Login successful! Redirecting...";


            setTimeout(function () {

                window.location.href = "index.html";

            }, 800);


        } else {

            loginMessage.style.color = "red";
            loginMessage.textContent =
                "Invalid username or password.";

        }

    } catch (error) {

        console.error(error);

        loginMessage.style.color = "red";

        loginMessage.textContent =
            "Unable to load login data. Please run the website using a local server.";

    }

});
