let email;
let operation = "getotp";

document.addEventListener("keydown", (e) => {
    const inputBox = document.querySelector("input:focus");
    const button = document.getElementById("butt");
    if (inputBox && e.key !== "Enter") {
        inputBox.value += e.key.length === 1 ? e.key : "";
    }
    if (e.key === "Enter") {
        switch (operation) {
            case "getotp":
                button?.click();
                break;
            case "submit":
                button?.click();
                break;
            case "reset":
                document.getElementById("reset")?.click();
                break;
        }
    }
});

function butt(opt) {
    if (opt) {
        document.getElementById("butt").disabled = true;
    } else {
        setTimeout(() => {
            document.getElementById("butt").disabled = false;
        }, 50000);
    }
}

async function getOTP() {
    window.localStorage.setItem("email", email);
    email = document.getElementById("email").value;
    await axios.post(`${window.location.href.split('/').slice(0,3).join('/')}/forgotPasswordGetOtp`, { email })
        .then(response => {
            alert(response.data.message);
            operation = "submit";
            document.getElementById("box").innerHTML = `
                <h2>Otp sended to ${email}</h2>
                <input type="text" id="otp" placeholder="Enter Your 6-digit OTP" required>
                <button type="button" onclick="submitOTP()" id="butt">Submit OTP</button>
            `;
        })
        .catch(error => {
            if (error.response.data.message === "Email not found pls SignUp") {
                alert(error.response.data.message);
                window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/signup`;
            }
        });
}

async function submitOTP() {
    const otp = document.getElementById("otp").value;
    if (otp.length !== 6) {
        alert("Please enter a valid OTP.");
        return;
    }
    email = window.localStorage.getItem("email");
    await axios.post(`${window.location.href.split('/').slice(0,3).join('/')}/forgotPasswordVerifyOtp`, { otp, email })
        .then(response => {
            alert(response.data.message);
            operation = "reset";
            document.getElementById("box").innerHTML = `
                <form id="resetForm">
                    <h1>Reset Password</h1>
                    <div class="input-group">
                        <input type="password" id="newPassword" placeholder="New Password" minlength="8" required>
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" minlength="8" required>
                    </div>
                    <button type="button" onclick="resetPassword()" id="reset">Reset Password</button>
                </form>
            `;
            window.localStorage.setItem("email", "");
        })
        .catch(error => {
            alert(error.response.data.message);
        });
}

function googleLoginButton() {
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/auth/google`;
}

function githubLoginButton() {
    window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/auth/github`;
}

async function resetPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    await axios.post(`${window.location.href.split('/').slice(0,3).join('/')}/resetPassword`, { password: newPassword })
        .then(response => {
            alert(response.data.message);
            window.location.href = `${window.location.href.split('/').slice(0,3).join('/')}/`;
        })
        .catch(error => {
            alert(error.response.data.message);
        });
}
