const fs = require("fs");
let students;

try {
    const data = fs.readFileSync("students.json", "utf8");
    students = JSON.parse(data);
} catch (error) {
    console.log("Error reading students.json:", error.message);
    process.exit(1);
}
function getAverageGrade(student) {
    if (!student || !Array.isArray(student.grades) || student.grades.length === 0) {
        return 0;
    }

    const total = student.grades.reduce((sum, grade) => sum + grade, 0);

    return total / student.grades.length;
}
function getTopStudents(students, n) {
    if (!Array.isArray(students)) {
        throw new Error("Students must be an array.");
    }

    if (!Number.isInteger(n) || n < 0) {
        throw new Error("Number of students must be a non-negative integer.");
    }

    return students
        .map(student => ({
            ...student,
            averageGrade: getAverageGrade(student)
        }))
        .sort((a, b) => b.averageGrade - a.averageGrade)
        .slice(0, n);
}
function groupByCourse(students) {
    return students.reduce((groups, student) => {
        const course = student.course || "Unknown";

        if (!groups[course]) {
            groups[course] = [];
        }

        groups[course].push({
            ...student
        });

        return groups;
    }, {});
}
function getEnrolledCount(students) {
    const enrolled = students.filter(
        student => student.enrolled === true
    ).length;

    const notEnrolled = students.filter(
        student => student.enrolled !== true
    ).length;

    return {
        enrolled: enrolled,
        notEnrolled: notEnrolled
    };
}
function findStudent(students, name) {
    if (typeof name !== "string") {
        throw new Error("Name must be a string.");
    }

    const searchName = name.trim().toLowerCase();

    const student = students.find(
        student =>
            typeof student.name === "string" &&
            student.name.toLowerCase() === searchName
    );

    return student ? { ...student } : null;
}
function findStudent(students, name) {
    if (typeof name !== "string") {
        throw new Error("Name must be a string.");
    }

    const searchName = name.trim().toLowerCase();

    const student = students.find(
        student =>
            typeof student.name === "string" &&
            student.name.toLowerCase() === searchName
    );

    return student ? { ...student } : null;
}
function exportSummary(students) {
    const allGrades = students.flatMap(student =>
        Array.isArray(student.grades)
            ? student.grades
            : []
    );

    const overallAverageGrade =
        allGrades.length === 0
            ? 0
            : allGrades.reduce(
                (sum, grade) => sum + grade,
                0
            ) / allGrades.length;

    const topStudents = getTopStudents(students, 1);

    return {
        totalStudents: students.length,

        overallAverageGrade:
            Number(overallAverageGrade.toFixed(2)),

        topPerformingStudent:
            topStudents.length > 0
                ? {
                    id: topStudents[0].id,
                    name: topStudents[0].name,
                    year: topStudents[0].year,
                    course: topStudents[0].course,
                    averageGrade:
                        Number(
                            topStudents[0].averageGrade.toFixed(2)
                        )
                }
                : null,

        breakdownByCourse:
            getCourseAverages(students).map(course => ({
                course: course.course,
                averageGrade:
                    Number(course.averageGrade.toFixed(2))
            }))
    };
}
function main() {

    console.log("======================================");
    console.log("    STUDENT RECORDS DATA PROCESSOR");
    console.log("======================================");

    console.log("\n1. TOTAL STUDENTS");
    console.log("--------------------------------------");

    console.log(`Total Students: ${students.length}`);


    console.log("\n2. ENROLLMENT STATUS");
    console.log("--------------------------------------");

    const enrollment = getEnrolledCount(students);

    console.log(`Enrolled: ${enrollment.enrolled}`);
    console.log(`Not Enrolled: ${enrollment.notEnrolled}`);


    console.log("\n3. OVERALL AVERAGE GRADE");
    console.log("--------------------------------------");

    const summary = exportSummary(students);

    console.log(
        `Overall Average: ${summary.overallAverageGrade.toFixed(2)}`
    );


    console.log("\n4. TOP-PERFORMING STUDENTS");
    console.log("--------------------------------------");

    const topStudents = getTopStudents(students, 3);

    topStudents.forEach((student, index) => {
        console.log(
            `${index + 1}. ${student.name} - ` +
            `${student.course} - ` +
            `Average: ${student.averageGrade.toFixed(2)}`
        );
    });


    console.log("\n5. AVERAGE GRADE BY COURSE");
    console.log("--------------------------------------");

    const courseAverages = getCourseAverages(students);

    courseAverages.forEach(course => {
        console.log(
            `${course.course}: ${course.averageGrade.toFixed(2)}`
        );
    });


    console.log("\n6. STUDENTS GROUPED BY COURSE");
    console.log("--------------------------------------");

    const grouped = groupByCourse(students);

    Object.entries(grouped).forEach(
        ([course, courseStudents]) => {

            console.log(`\n${course}:`);

            courseStudents.forEach(student => {
                console.log(`- ${student.name}`);
            });
        }
    );


    console.log("\n7. STUDENT SEARCH");
    console.log("--------------------------------------");

    if (students.length > 0) {

        const searchName = students[0].name;

        const foundStudent =
            findStudent(students, searchName);

        if (foundStudent) {
            console.log(`Found: ${foundStudent.name}`);
            console.log(`ID: ${foundStudent.id}`);
            console.log(`Course: ${foundStudent.course}`);
            console.log(
                `Average: ${getAverageGrade(foundStudent).toFixed(2)}`
            );
        } else {
            console.log("Student not found.");
        }

    } else {
        console.log("No students available.");
    }


    console.log("\n8. COMPLETE SUMMARY");
    console.log("--------------------------------------");

    console.log(
        JSON.stringify(summary, null, 2)
    );


    fs.writeFileSync(
        "report.json",
        JSON.stringify(summary, null, 2),
        "utf8"
    );

    console.log("\nreport.json created successfully.");

    console.log("\n======================================");
    console.log("          REPORT COMPLETE");
    console.log("======================================");
}
main();
