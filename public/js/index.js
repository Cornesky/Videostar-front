let badmdp = false;

const login = () => {
    document.cookie = "role=user";
    let email = document.querySelector("#emailLog").value;
    let password = document.querySelector("#passLog").value;
    let data = { username: email, password: password };
    axios
        .post("https://127.0.0.1:8000/api/login", data)
        .catch(function (error) {
            if (error.response) {
                if (!badmdp) {
                    document.querySelector("#bad").innerHTML =
                        "<p>L'identifiant ou le mdp est éroné</p>";
                    badmdp = true;
                }
            } else {
                console.log("Error", error.message);
            }
        })
        .then((response) => {
            if (typeof response.data !== undefined) {
                if (response.data.roles[0] === "ROLE_ADMIN") {
                    document.cookie = "role=admin";
                    document.location.href = "/admin.html";
                } else {
                    document.cookie = "role=user";
                    document.location.href = "/user.html";
                }
            }
        });
};
