class PatientsDatabase {
  constructor() {}

  // Save all patients record
  savePatients(patients) {
    localStorage.setItem("patients", JSON.stringify(patients));
  }

  getPatients() {
    let patients;
    patients = JSON.parse(localStorage.getItem("patients"));
    return patients;
  }
}
