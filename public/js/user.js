const allDoc = [];

const pageDoc = [];

const allType = [];

let typeCount = false;

let yearCount = false;

let page = 1;

const loadDoc = async () => {
    response = await axios.get("https://127.0.0.1:8000/api/documents");
    let display = "";
    response.data["hydra:member"].forEach((element) => {
        allDoc.push(element);
    });
    for (let i = 0; i < 10; i++) {
        pageDoc.push(allDoc[i]);
    }
    pageDoc.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    document.querySelector("#prevBtn").style.display = "none";
};

const loadType = async () => {
    let responseType = await axios.get("https://127.0.0.1:8000/api/types");
    let displayType = "";
    responseType.data["hydra:member"].forEach((element) => {
        allType.push(element);
        displayType += `
        <option value="${element.id}">${element.name}</option>
        `;
    });
    document.querySelector(".allType").innerHTML += displayType;
};

const clean = () => {
    document.querySelector("#title").value = "";
    document.querySelector("#type").value = "0";
    document.querySelector("#year").value = "";
    let display = "";
    pageDoc.splice(0, pageDoc.length);
    for (let i = 0; i < 10; i++) {
        pageDoc.push(allDoc[i]);
    }
    pageDoc.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    document.querySelector("#nextBtn").style.display = "block";
};

document.querySelector("#filterTitle").addEventListener("click", () => {
    let reverse = pageDoc.reverse();
    let display = "";
    reverse.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    typeCount = false;
    yearCount = false;
});

document.querySelector("#filterType").addEventListener("click", () => {
    let reverse = [];

    for (let i = 0; i <= allType.length; i++) {
        pageDoc.forEach((doc) => {
            if (i === doc.type.id) {
                reverse.push(doc);
            }
        });
    }

    if (!typeCount) {
        typeCount = true;
    } else {
        reverse = reverse.reverse();
        typeCount = false;
    }
    let display = "";
    reverse.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    yearCount = false;
});

document.querySelector("#filterYear").addEventListener("click", () => {
    let reverse = [];
    for (let i = 0; i < pageDoc.length; i++) {
        reverse.push(pageDoc[i]);
    }
    reverse
        .sort(function (a, b) {
            return a.year - b.year;
        })
        .reverse();
    if (!yearCount) {
        yearCount = true;
    } else {
        reverse = reverse.reverse();
        yearCount = false;
    }
    let display = "";
    reverse.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    typeCount = false;
});

const previusPage = () => {
    page--;
    let max = page * 10;
    let min = 0;
    document.querySelector("#nextBtn").style.display = "block";
    pageDoc.splice(0, pageDoc.length);
    if (page === 1) {
        document.querySelector("#prevBtn").style.display = "none";
    } else {
        min = max - 10;
    }
    for (let i = min; i < max; i++) {
        pageDoc.push(allDoc[i]);
    }
    let display = "";
    pageDoc.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
};

const nextPage = () => {
    let max = 0;
    let min = page * 10;
    document.querySelector("#prevBtn").style.display = "block";
    pageDoc.splice(0, pageDoc.length);
    if (allDoc.length - min > 10) {
        max = page * 10 + 10;
    } else {
        max = allDoc.length;
        document.querySelector("#nextBtn").style.display = "none";
    }
    for (let i = min; i < max; i++) {
        pageDoc.push(allDoc[i]);
    }
    let display = "";
    pageDoc.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
    page++;
};

const search = async () => {
    let display = "";
    let request = "";
    pageDoc.splice(0, pageDoc.length);
    let title = document.querySelector("#title").value;
    let year = document.querySelector("#year").value;
    let type = parseInt(document.querySelector("#type").value);
    if (title.length === 0 && year.length === 0) {
        if (type === 0) {
            for (let i = 0; i < 10; i++) {
                pageDoc.push(allDoc[i]);
            }
        } else {
            allDoc.forEach((element) => {
                if (type === element.type.id) {
                    pageDoc.push(element);
                }
            });
        }
    } else {
        if (title.length !== 0) {
            title = "title=" + title;
        }
        if (year.length !== 0) {
            if (title.length !== 0) {
                year = "&year=" + year;
            } else {
                year = "year=" + year;
            }
        }
        let resp = await axios.get(
            `https://127.0.0.1:8000/api/documents?${title + year}`
        );
        resp.data["hydra:member"].forEach((element) => {
            if (type !== 0) {
                if (type === element.type.id) {
                    pageDoc.push(element);
                }
            } else {
                pageDoc.push(element);
            }
        });
    }
    document.querySelector("#nextBtn").style.display = "none";
    pageDoc.forEach((element) => {
        display += `
        <tr id="${element.id}">
            <td>${element.title}</td>
            <td>${element.type.name}</td>
            <td>${element.year}</td>
        </tr>`;
    });
    document.querySelector("#test").innerHTML = display;
};
