
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}




let students = [];
let editIndex = -1;




const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const yearFilter = document.getElementById("yearFilter");

const clearBtn = document.getElementById("clearBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

const submitBtn = document.getElementById("submitBtn");




const username = localStorage.getItem("username");
const role = localStorage.getItem("role");

if (userInfo) {

    if (username && role) {
        userInfo.textContent =
            username + " (" + role + ")";
    } else {
        userInfo.textContent = "User";
    }

}




function loadStudents() {

    
    const savedStudents =
        localStorage.getItem("students");


    if (savedStudents) {

        try {

            students = JSON.parse(savedStudents);

            displayStudents();

        } catch (error) {

            console.error(
                "Error reading localStorage:",
                error
            );

            loadStudentsFromJSON();

        }

    } else {

       
        loadStudentsFromJSON();

    }

}




async function loadStudentsFromJSON() {

    try {

        const response =
            await fetch("students.json");


        if (!response.ok) {

            throw new Error(
                "students.json could not be loaded."
            );

        }


        const data =
            await response.json();


        students = data;


        
        saveStudents();


        displayStudents();


    } catch (error) {

        console.error(
            "Error loading students.json:",
            error
        );


        students = [];


        displayStudents();


        alert(
            "Unable to load students.json. " +
            "Please make sure the file is in the same folder."
        );

    }

}




function displayStudents(data = students) {

    if (!studentTableBody) {
        return;
    }


    studentTableBody.innerHTML = "";


    
    if (data.length === 0) {

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="no-data">
                    No student records found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(function(student) {

       
        const realIndex =
            students.indexOf(student);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(student.studentId)}
            </td>

            <td>
                ${escapeHTML(student.name)}
            </td>

            <td>
                ${escapeHTML(student.course)}
            </td>

            <td>
                ${escapeHTML(student.yearLevel)}
            </td>

            <td>
                ${escapeHTML(student.contact)}
            </td>

            <td>
                ${escapeHTML(student.academicStatus)}
            </td>

            <td>
                ${escapeHTML(student.subject)}
            </td>

            <td>
                ${student.units}
            </td>

            <td>

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editStudent(${realIndex})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteStudent(${realIndex})"
                >
                    Delete
                </button>

            </td>
        `;


        studentTableBody.appendChild(row);

    });

}




if (studentForm) {

    studentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            
            const studentId =
                document.getElementById("studentId")
                    .value.trim();

            const name =
                document.getElementById("studentName")
                    .value.trim();

            const course =
                document.getElementById("course")
                    .value;

            const yearLevel =
                document.getElementById("yearLevel")
                    .value;

            const contact =
                document.getElementById("contact")
                    .value.trim();

            const academicStatus =
                document.getElementById("academicStatus")
                    .value;

            const subject =
                document.getElementById("subject")
                    .value.trim();

            const units =
                Number(
                    document.getElementById("units")
                        .value
                );


            
            if (
                !studentId ||
                !name ||
                !course ||
                !yearLevel ||
                !contact ||
                !academicStatus ||
                !subject ||
                !units
            ) {

                alert(
                    "Please complete all fields."
                );

                return;
            }


            if (units < 1 || units > 30) {

                alert(
                    "Units must be between 1 and 30."
                );

                return;
            }


            const student = {

                studentId: studentId,

                name: name,

                course: course,

                yearLevel: yearLevel,

                contact: contact,

                academicStatus: academicStatus,

                subject: subject,

                units: units

            };


         

            if (editIndex !== -1) {

                

                const duplicate =
                    students.some(
                        function(existingStudent, index) {

                            return (
                                index !== editIndex &&
                                existingStudent.studentId
                                    .toLowerCase() ===
                                studentId.toLowerCase()
                            );

                        }
                    );


                if (duplicate) {

                    alert(
                        "Another student already uses this Student ID."
                    );

                    return;
                }


                students[editIndex] =
                    student;


                alert(
                    "Student updated successfully!"
                );

            }


            

            else {

                const duplicate =
                    students.some(
                        function(existingStudent) {

                            return (
                                existingStudent.studentId
                                    .toLowerCase() ===
                                studentId.toLowerCase()
                            );

                        }
                    );


                if (duplicate) {

                    alert(
                        "Student ID already exists."
                    );

                    return;
                }


                students.push(student);


                alert(
                    "Student added successfully!"
                );

            }


            
            saveStudents();


            
            displayStudents();


            
            clearForm();

        }
    );

}




function editStudent(index) {

    if (!students[index]) {

        alert(
            "Student record not found."
        );

        return;
    }


    const student =
        students[index];


    document.getElementById("studentId")
        .value = student.studentId;

    document.getElementById("studentName")
        .value = student.name;

    document.getElementById("course")
        .value = student.course;

    document.getElementById("yearLevel")
        .value = student.yearLevel;

    document.getElementById("contact")
        .value = student.contact;

    document.getElementById("academicStatus")
        .value = student.academicStatus;

    document.getElementById("subject")
        .value = student.subject;

    document.getElementById("units")
        .value = student.units;


    editIndex = index;


    if (submitBtn) {

        submitBtn.textContent =
            "Update Student";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}




function deleteStudent(index) {

    if (!students[index]) {

        alert(
            "Student record not found."
        );

        return;
    }


    const student =
        students[index];


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            student.name +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    students.splice(index, 1);


    saveStudents();


    displayStudents();


    
    if (editIndex === index) {

        clearForm();

    }


    alert(
        "Student deleted successfully!"
    );

}



function filterStudents() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const selectedCourse =
        courseFilter
            ? courseFilter.value
            : "";


    const selectedYear =
        yearFilter
            ? yearFilter.value
            : "";


    const filtered =
        students.filter(
            function(student) {

                const studentId =
                    String(
                        student.studentId || ""
                    ).toLowerCase();


                const name =
                    String(
                        student.name || ""
                    ).toLowerCase();


                const matchesSearch =
                    studentId.includes(search) ||
                    name.includes(search);


                const matchesCourse =
                    selectedCourse === "" ||
                    student.course === selectedCourse;


                const matchesYear =
                    selectedYear === "" ||
                    student.yearLevel === selectedYear;


                return (
                    matchesSearch &&
                    matchesCourse &&
                    matchesYear
                );

            }
        );


    displayStudents(filtered);

}



function clearForm() {

    if (studentForm) {

        studentForm.reset();

    }


    editIndex = -1;


    if (submitBtn) {

        submitBtn.textContent =
            "Add Student";

    }

}



function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}




if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "loggedIn"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "role"
            );


            window.location.href =
                "login.html";

        }
    );

}




if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterStudents
    );

}


if (courseFilter) {

    courseFilter.addEventListener(
        "change",
        filterStudents
    );

}


if (yearFilter) {

    yearFilter.addEventListener(
        "change",
        filterStudents
    );

}




if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        clearForm
    );

}



function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}




loadStudents();

