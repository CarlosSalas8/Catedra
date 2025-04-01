
const {log} = require("firebase-functions/logger");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const admin = require("./conf").admin;
const db = admin.firestore();
const sendEmail = require("./mailer");


/* Send an email to all teachers with a approved student. Send a copy to the student and director */
export const sendEmailTeachers = onCall(async (request: any) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  log("User authenticated: " + request.auth.uid);

  // Check if the user is an admin
  db.collection("users").doc(request.auth.uid).get().then((doc: { exists: any; data: () => any; }) => {
    if (!doc.exists) {
      throw new HttpsError("not-found", "User not found.");
    }
    const user = doc.data();
    if (user.role !== "admin") {
      throw new HttpsError("permission-denied", "User is not an admin.");
    }
    return user;
  });

  // Get all teachers data
  const teachers = await db.collection("teachers").get();

  // Loop through all teachers and send an email to each one
  teachers.forEach(async (teacher: { data: () => any; }) => {
    const teacherData = teacher.data();
    const email = teacherData.email;

    // Get active period 
    const period = await db.collection("period").where("status", "==", true).get();
    if (period.empty) {
      throw new HttpsError("not-found", "No active period found.");
    }
    const periodData = period.docs[0].data();

    // Get the students data from postulant collection
    const students = await db.collection("postulant")
      .where("periodID", "==", periodData.id)
      .where("emailTeacher", "==", teacherData.email)
      .where("plazaID", "==", teacherData.plaza || "")
      .where("validated", "==", true)
      .where("isTest", "==", true).get();

    log("Students found: " + students.size);
    if (students.empty) {
      log("No students found for teacher: " + email);
      return;
    }
    log("Students found for teacher: " + email + " with size: " + students.size);
      
    // Send an email to the teacher with each students data
    students.docs.forEach(async (student: { data: () => any; }) => {
      const studentData = student.data();
      const studentEmail = studentData.usuario.email;
      const studentName = studentData.usuario.name;
      const subject = "Oficio de inicio del Proyecto de Ayudantes de Catedra";

      const replacements = {
        // Date with this format: Lunes, 31 de Marzo de 2025
        date: new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        studentName: studentName,
        subject: teacherData.subject,
        teacherName: teacherData.name,
        email: studentEmail,
        career: teacherData.career || studentData.usuario.career,
        ci: studentData.ci,
        phone: studentData.phone,
        period: periodData.name,
      };
      await sendEmail.sendEmail(email, subject, replacements, [studentEmail, teacherData.emailDirector]);
      log("Email sent to teacher: " + email + " with student data: " + studentData.usuario.name);
    });
  });

  return { success: true, message: "Emails sent successfully." }; 
},);