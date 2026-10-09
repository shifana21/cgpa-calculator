
const subjectList = document.getElementById("subject-list");
const semesterSelect = document.getElementById("semester");
const message = document.getElementById("message");

function addSubject(name = "", grade = "", credits = "") {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="subject-name"
      placeholder="e.g. Mathematics" maxlength="80"></td>
    <td><input type="number" class="grade-point"
      placeholder="0–10" min="0" max="10" step="0.01"></td>
    <td><input type="number" class="subject-credits"
      placeholder="e.g. 4" min="0.01" max="100" step="0.01"></td>
    <td><button type="button" class="delete-btn">Remove</button></td>
  `;

  row.querySelector(".subject-name").value = name;
  row.querySelector(".grade-point").value = grade;
  row.querySelector(".subject-credits").value = credits;

  row.querySelector(".delete-btn").addEventListener("click", () => {
    row.remove();
    calculateResults();
  });

  row.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      message.textContent = "";
    });
  });

  subjectList.appendChild(row);
}

function getSubjects() {
  const subjects = [];

  for (const row of subjectList.querySelectorAll("tr")) {
    const name = row.querySelector(".subject-name").value.trim();
    const gradeInput = row.querySelector(".grade-point");
    const creditsInput = row.querySelector(".subject-credits");

    const gradeText = gradeInput.value.trim();
    const creditsText = creditsInput.value.trim();

    if (!name || gradeText === "" || creditsText === "") {
      throw new Error("Please complete every subject's name, grade point, and credits.");
    }

    const grade = Number(gradeText);
    const credits = Number(creditsText);

    if (!Number.isFinite(grade) || grade < 0 || grade > 10) {
      throw new Error("Grade points must be between 0 and 10.");
    }

    if (!Number.isFinite(credits) || credits <= 0 || credits > 100) {
      throw new Error("Credits must be greater than 0 and no more than 100.");
    }

    subjects.push({
      name,
      grade,
      credits,
      semester: Number(semesterSelect.value)
    });
  }

  return subjects;
}

function calculateResults() {
  try {
    message.textContent = "";

    const subjects = getSubjects();

    if (subjects.length === 0) {
      throw new Error("Add at least one subject before calculating.");
    }

    const totalCredits = subjects.reduce(
      (sum, subject) => sum + subject.credits, 0
    );

    const weightedPoints = subjects.reduce(
      (sum, subject) => sum + subject.grade * subject.credits, 0
    );

    const semesterSubjects = subjects.filter(
      subject => subject.semester === Number(semesterSelect.value)
    );

    const semesterCredits = semesterSubjects.reduce(
      (sum, subject) => sum + subject.credits, 0
    );

    const semesterPoints = semesterSubjects.reduce(
      (sum, subject) => sum + subject.grade * subject.credits, 0
    );

    const cgpa = weightedPoints / totalCredits;
    const gpa = semesterCredits > 0
      ? semesterPoints / semesterCredits
      : 0;

    document.getElementById("cgpa").textContent = cgpa.toFixed(2);
    document.getElementById("gpa").textContent = gpa.toFixed(2);
    document.getElementById("credits").textContent =
      Number(totalCredits.toFixed(2)).toString();
    document.getElementById("semester-label").textContent =
      `Semester ${semesterSelect.value}`;

  } catch (error) {
    message.textContent = error.message;
  }
}

document.getElementById("add-subject").addEventListener("click", () => {
  addSubject();
});

document.getElementById("calculate").addEventListener("click", () => {
  calculateResults();
});

semesterSelect.addEventListener("change", calculateResults);

// Start with three sample subjects for easy testing.
addSubject("Python", 9, 4);
addSubject("DBMS", 8, 3);
addSubject("Mathematics", 10, 4);
calculateResults();