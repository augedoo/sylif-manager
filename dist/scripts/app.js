// Global var
const ui = new UI();
const patientsDatabase = new PatientsDatabase();
let newListTotalAmount = 0;
let currentPatientMedList = [];
let patientsList, edittingRecord, EDITING_MEDICINE_INDEX;
let red = "#D86167",
  green = "#28B596";

runEvents();

// Events
function runEvents() {
  // > Mouse
  ui.addPatientBtn.addEventListener("click", ui.showSideBar);
  ui.closeSidebar.addEventListener("click", ui.closeSideBar);
  ui.closeSidebar.addEventListener("click", resetFormValues);
  ui.addMedicineBtn.addEventListener("click", addPatientMedicine);
  ui.submitBtn.addEventListener("click", validateAndAddPatientRecord);
  ui.medicineContainer.addEventListener("click", deleteMedicine);
  ui.table.addEventListener("click", deletePatientRecord);
  ui.table.addEventListener("click", editPatientRecord);
  ui.submitBtn.addEventListener("click", updatePatientRecord);
  ui.mainSidebarToggler.addEventListener("click", ui.toggleMainSidebar);
  // > Keyboard
  ui.medicineNameInput.addEventListener("keyup", updateMedicinePrice);
  ui.medicineNameInput.addEventListener("keydown", keyboardShortcuts);
  ui.priceInput.addEventListener("keydown", keyboardShortcuts);
  // > DOM
  window.addEventListener("DOMContentLoaded", getMedicineOptions);
  window.addEventListener("DOMContentLoaded", loadPatientRecords);
  window.addEventListener("DOMContentLoaded", ui.highlightOwingPatients);
  ui.medicineContainer.addEventListener("change", purchaseMedicine);
  ui.deptToggler.addEventListener("change", ui.toggleDeptAmountInput);
  ui.searchInput.addEventListener("keyup", filterPatients);
}

// Load patient records
function loadPatientRecords() {
  if (localStorage.getItem("patients") === null) {
    patientsList = [];
  } else {
    patientsList = patientsDatabase.getPatients();
    ui.populatePatientsRecords(patientsList);
  }
}

// validate and add new patient record
function validateAndAddPatientRecord() {
  // > If submit btn is in update mode, dont add new patient record
  if (this.classList.contains("update-patient-record")) {
    return;
  }

  // > Validate input field before adding patient new patient to database
  if (ui.nameInput.value === "") {
    ui.showAlert(red, "You need to add patient name", 3000);
    ui.nameInput.focus();
  } else if (ui.medicineContainer.innerHTML === "") {
    ui.showAlert(
      red,
      "You need to add at least one medicine bought by the patient.",
      3000
    );
    ui.medicineNameInput.focus();
    return;
  } else if (
    ui.deptInput.classList.contains("shown") &&
    ui.deptInput.value == 0
  ) {
    ui.showAlert(red, "User dept cannot be 0.", 3000);
    ui.deptInput.focus();
    return;
  } else if (ui.mobileInput.value === "") {
    if (confirm("Do you want to proceed without adding patients number?")) {
      addPatientRecord();
    } else {
      ui.mobileInput.focus();
    }
  } else {
    addPatientRecord();
    resetFormValues();
  }
}

// Add new patient record
function addPatientRecord() {
  let name = ui.nameInput.value.toLowerCase();
  let mobile = ui.mobileInput.value || "";
  const patient = new Patient(name, mobile);
  patient.deptAmount = parseFloat(ui.deptInput.value).toFixed(2);
  patient.meds = currentPatientMedList;
  patient.totalMedsAmount = patient.calculateTotalMedsAmount();
  patientsList.push(patient);
  patientsDatabase.savePatients(patientsList);
  ui.populatePatientsRecords(patientsDatabase.getPatients());
}

// Delete patient record
function deletePatientRecord(e) {
  if (e.target.classList.contains("delete-patient-record")) {
    const tdName =
      e.target.parentElement.parentElement.parentElement.parentElement
        .firstElementChild.nextElementSibling.textContent;

    const tdMobile =
      e.target.parentElement.parentElement.parentElement.parentElement
        .firstElementChild.nextElementSibling.nextElementSibling.textContent;

    if (confirm("Are you sure you want to delete patients record?")) {
      patientsList.forEach((patient, index) => {
        if (patient.name === tdName && patient.mobile === tdMobile) {
          patientsList.splice(index, 1);
        }
      });
      patientsDatabase.savePatients(patientsList);
      ui.populatePatientsRecords(patientsList);
    } else {
      return;
    }
  }
}

// Edit patient record
function editPatientRecord(e) {
  if (e.target.classList.contains("edit-patient-record")) {
    // > get table data fields
    const tdName = e.target.closest("tr").firstElementChild.nextElementSibling
      .textContent;

    const tdMobile = e.target.closest("tr").firstElementChild.nextElementSibling
      .nextElementSibling.textContent;

    // > populate selected patient record in sidebar fields
    patientsList.forEach((patient, index) => {
      if (patient.name === tdName && patient.mobile === tdMobile) {
        // > save the currently editting medicine index for update purposes
        EDITING_MEDICINE_INDEX = index;
        edittingRecord = patientsList.slice(index, index + 1)[0];
        ui.showSideBar();
        ui.nameInput.value = edittingRecord.name;
        ui.mobileInput.value = edittingRecord.mobile;
        if (parseInt(edittingRecord.deptAmount) !== 0) {
          ui.deptToggler.checked = true;
          ui.deptInput.classList.add("shown");
          ui.deptInput.value = edittingRecord.deptAmount;
        }
        currentPatientMedList = edittingRecord.meds;
        newListTotalAmount = parseFloat(edittingRecord.totalMedsAmount);
        ui.updateTotalAmount(newListTotalAmount);
        ui.populateMedicineList(currentPatientMedList);
        ui.submitBtn.value = "Update";
        ui.submitBtn.classList.add("update-patient-record");
      }
    });
  }
}

// Update patient record
function updatePatientRecord(e) {
  if (this.classList.contains("update-patient-record")) {
    let name = ui.nameInput.value;
    let mobile = ui.mobileInput.value || "";

    const edittedRecord = new Patient(name, mobile);
    edittedRecord.deptAmount = parseFloat(ui.deptInput.value).toFixed(2);
    edittedRecord.meds = currentPatientMedList;
    edittedRecord.totalMedsAmount = newListTotalAmount;

    if (confirm("Are you sure you wnat to change patient details")) {
      // > Search for matching record and update that patients record.
      patientsList.forEach((record, index) => {
        if (
          record.name === edittingRecord.name &&
          record.mobile === edittingRecord.mobile &&
          index === EDITING_MEDICINE_INDEX
        ) {
          patientsList.splice(index, 1, edittedRecord);
        }
      });

      patientsDatabase.savePatients(patientsList);
      ui.populatePatientsRecords(patientsDatabase.getPatients());
      ui.submitBtn.classList.remove("update-patient-record");
      ui.submitBtn.value = "Add Patient";
      resetFormValues();
      ui.closeSideBar();
    } else {
      return;
    }
  }
}

// Filter patients records
function filterPatients(e) {
  // > Get the query
  const query = this.value.toLowerCase();
  // > Get all table rows
  const trs = document.querySelectorAll("tbody tr");
  // > Compare names and mobile nums to query for matches
  trs.forEach((tr) => {
    const trName = tr.cells[1].textContent.toLowerCase();
    const trMobile = tr.cells[2].textContent.toLowerCase();
    if (trName.includes(query) || trMobile.indexOf(query) !== -1) {
      tr.style.display = "grid";
    } else {
      tr.style.display = "none";
    }
  });
}

// Add new medicine in sidebar
function addPatientMedicine() {
  // > Get ui fields values
  const medicineName = ui.medicineNameInput.value.toLowerCase();
  const price = parseFloat(ui.priceInput.value);

  // > Validate user input
  if (medicineName === "") {
    ui.showAlert(red, "You need to enter medicine name.", 3000);
    ui.medicineNameInput.focus();
    return;
  } else if (isNaN(price) || price === 0) {
    ui.showAlert(red, "Price of medicine cannot be 0", 3000);
    ui.priceInput.focus();
    return;
  }

  // > Create a medicine object
  const newMedicine = {
    name: medicineName,
    price: price,
    isPurchased: false,
  };
  // > Check if medicine is already exist else add it
  if (currentPatientMedList.length === 0) {
    currentPatientMedList.push(newMedicine);
    ui.populateMedicineList(currentPatientMedList);
    newListTotalAmount = newMedicine.price;
    ui.updateTotalAmount(newListTotalAmount);
    ui.medicineNameInput.value = "";
    ui.priceInput.value = "";
    ui.medicineNameInput.focus();
  } else {
    const meds = currentPatientMedList.map((item) => item.name);
    if (meds.includes(medicineName)) {
      ui.showAlert(red, "Medicine already selected", 3000);
      ui.medicineNameInput.value = "";
      ui.priceInput.value = "";
      ui.medicineNameInput.focus();
    } else {
      currentPatientMedList.push(newMedicine);
      ui.populateMedicineList(currentPatientMedList);
      newListTotalAmount += newMedicine.price;
      ui.updateTotalAmount(newListTotalAmount);
      ui.priceInput.value = "";
      ui.medicineNameInput.value = "";
      ui.medicineNameInput.focus();
    }
  }
}

// Delete medicine from the selection
function deleteMedicine(e) {
  if (e.target.classList.contains("delete-med-btn")) {
    const medicineName = e.target.parentElement.previousElementSibling.textContent.toLowerCase();
    currentPatientMedList.forEach((med, index) => {
      if (med.name === medicineName) {
        newListTotalAmount -= med.price;
        ui.updateTotalAmount(newListTotalAmount);
        currentPatientMedList.splice(index, 1);
        while (ui.medicineContainer.firstElementChild) {
          ui.medicineContainer.firstElementChild.remove();
        }
        ui.populateMedicineList(currentPatientMedList);
      }
    });
  }
}

// Select purchased medicine from the med list
function purchaseMedicine(e) {
  if (e.target.classList.contains("is-med-purchased")) {
    const medicineName = e.target.parentElement.previousElementSibling.textContent.toLowerCase();
    if (e.target.checked) {
      currentPatientMedList.forEach((med) => {
        if (med.name === medicineName) {
          med.isPurchased = true;
        }
      });
    } else {
      currentPatientMedList.forEach((med) => {
        if (med.name === medicineName) {
          med.isPurchased = false;
        }
      });
    }
  }
}

// Get medicine name and peek in medicine input
function getMedicineOptions() {
  fetch("settings/medicine-collection.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      const medicineNames = data.map((medicine) => medicine["medicine-name"]);
      let output = "";
      medicineNames.forEach((medicine) => {
        output += `<option>${medicine}</option>`;
      });
      ui.medicineList.innerHTML = output;
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Update medicine price field on the fly when drop-down-value is changed
function updateMedicinePrice(e) {
  const priceField = document.querySelector(".select-med-panel #price");
  const query = e.target.value.toLowerCase();

  // > Update medicine price
  fetch("settings/medicine-collection.json")
    .then(function (res) {
      return res.json();
    })
    .then((response) => {
      response.forEach((medicine) => {
        if (medicine["medicine-name"].toLowerCase() === query)
          priceField.value = medicine.price.toFixed(2);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Reset the form values and fields
function resetFormValues() {
  ui.nameInput.value = "";
  ui.mobileInput.value = "";
  ui.deptInput.value = "";
  if (ui.deptInput.classList.contains("shown")) {
    ui.deptInput.classList.remove("shown");
  }
  ui.deptToggler.checked = false;
  ui.medicineNameInput.value = "";
  ui.priceInput.value = "";
  ui.submitBtn.classList.remove("update-patient-record");
  ui.submitBtn.value = "Add Patient";
  ui.medicineContainer.innerHTML = "";
  newListTotalAmount = 0;
  currentPatientMedList = [];
  ui.clearSideBarFields();
  ui.closeSideBar();
}

// Keyboard Shortcuts
function keyboardShortcuts(e) {
  // If (Enter) is pressed - Add selected medicine to list
  if (e.key === "Enter") {
    addPatientMedicine();
    ui.medicineNameInput.value = "";

    if (e.target.classList.contains("price-input")) {
      e.target.value = "";
      ui.priceInput.focus();
    }
  }

  // If (Ctrl + Backspace) is pressed - Clear input field
  if (e.key === "Backspace" && e.ctrlKey) {
    e.target.value = "";
  }

  // If (Ctrl + Space) is pressed -Submit user details
  if (e.code === "Space" && e.ctrlKey) {
    validateAndAddPatientRecord();
  }
}
