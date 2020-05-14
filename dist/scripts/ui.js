class UI {
  constructor() {
    // UI variables
    this.addPatientBtn = document.querySelector(".add-record-btn");
    this.closeSidebar = document.querySelector(
      "#add-patient-sidebar .close-sidebar"
    );
    this.addMedicineBtn = document.querySelector(".add-med-btn button");
    this.form = document.querySelector("#add-patient-sidebar form");
    this.table = document.querySelector("#patients-list table");
    this.nameInput = document.getElementById("name");
    this.mobileInput = document.getElementById("tel");
    this.medicineContainer = document.querySelector(
      "#add-patient-sidebar .medicine .selected-medicine"
    );
    this.amount = document.querySelector(".total-cost .amount");
    this.medicineNameInput = document.querySelector(
      ".select-med-panel #medicine-input"
    );
    this.medicineList = document.querySelector(
      ".select-med-panel #medicine-list"
    );
    this.priceInput = document.querySelector(".select-med-panel #price");
    this.isPurchased = document.querySelector(
      ".select-med-panel #is-purchased"
    );
    this.totalAmount = document.querySelector(".total-cost .amount");
    this.patientsListContainer = document.querySelector(
      "#main-content .wrapper tbody"
    );
    this.deptToggler = document.querySelector(
      "#add-patient-sidebar .amount-owing .switch input"
    );
    this.deptInput = document.querySelector(
      "#add-patient-sidebar .amount-owing #dept-amount"
    );
    this.submitBtn = document.querySelector(
      "#add-patient-sidebar form #submit-btn"
    );
    this.searchInput = document.querySelector(".search-filter #search-input");
    this.mainSidebarToggler = document.querySelector("#main-header .hamburger");
    this.mainSidebar = document.querySelector("#main-sidebar");
  }

  // Toggle main sidebar
  toggleMainSidebar() {
    ui.mainSidebar.classList.toggle("main-sidebar-collapsed");
  }

  // Populate patients records
  populatePatientsRecords(patientsList) {
    // > clone the array and reversed the cloned array for population
    const reversedPatientsList = [...patientsList];
    reversedPatientsList.reverse();

    let output = "";
    reversedPatientsList.forEach((patient) => {
      let patientDiv;
      patientDiv = `
        <tr class="patient">
          <td class="date">${patient.date}</td>
          <td class="name">${patient.name}</td>
          <td>${patient.mobile}</td>
          <td class="medicines">
            <ul class="meds">
              ${patient.meds
                .map((med) => {
                  if (med.isPurchased === true) {
                    return (
                      '<li class="item"><span class="item-state">&#x2714;</span><span class="item-name">' +
                      med.name +
                      "</span></li>"
                    );
                  } else {
                    return (
                      '<li><span class="item-name">' + med.name + "</span></li>"
                    );
                  }
                })
                .join("")}
            </ul>
          </td>
          <td class="amount">
            &#x20B5;
            <div class="price">
              ${patient.totalMedsAmount}
            </div>
          </td>
          <td class="dept">
            &#x20B5;
              <div class="amount">${patient.deptAmount}</div>
          </td>
          <td class="action">
            <ul>
              <li>
                <span class="material-icons edit-patient-record">
                  edit
                </span>
              </li>
              <li>
                <span class="material-icons delete-patient-record">
                  close
                </span>
              </li>
            </ul>
          </td>
        </tr>
      `;
      output += patientDiv;
    });
    this.patientsListContainer.innerHTML = output;
  }

  // Populate medicine list in the selected medicine container
  populateMedicineList(medicineList) {
    let output = "";
    medicineList.forEach((medicine) => {
      if (medicine.isPurchased === true) {
        let li = `
        <li>
          <span class="selected-med-name">${
            medicine.name[0].toUpperCase() + medicine.name.slice(1)
          }</span>
          <div> 
          <input type="checkbox" class="is-med-purchased" checked/>
          <span class="delete-med-btn">X</span>
          <div>  
        </li>
      `;
        output += li;
      } else {
        let li = `
        <li>
          <span class="selected-med-name">${
            medicine.name[0].toUpperCase() + medicine.name.slice(1)
          }</span>
          <div> 
          <input type="checkbox" class="is-med-purchased"/>
          <span class="delete-med-btn">X</span>
          <div>  
        </li>
      `;
        output += li;
      }
    });
    this.medicineContainer.innerHTML = output;
  }

  // Amount total amount of medicines
  updateTotalAmount(amount) {
    typeof amount === "string"
      ? (this.totalAmount.innerHTML = parseInt(amount).toFixed(2))
      : (this.totalAmount.innerHTML = amount.toFixed(2));
  }

  // Toggle owing amount input field
  toggleDeptAmountInput() {
    // const deptInput = document.querySelector(
    //   "#add-patient-sidebar .amount-owing #dept-amount"
    // );

    if (this.checked === true) {
      ui.deptInput.classList.add("shown");
      ui.deptInput.focus();
    } else {
      ui.deptInput.classList.remove("shown");
      ui.deptInput.value = 0;
    }
  }

  // Reset sidebar form
  clearSideBarFields() {
    ui.form.reset();
    ui.amount.textContent = 0.0;
    ui.medicineContainer.innerHTML = "";
  }

  // Highlight all deptors
  highlightOwingPatients() {
    const trs = document.querySelectorAll("tbody tr");

    trs.forEach((tr) => {
      const deptCell = tr.cells[5];
      const dept = parseInt(deptCell.firstElementChild.textContent);
      if (dept !== 0) {
        deptCell.closest("tr").classList.add("owing-row");
      } else {
        deptCell.closest("tr").classList.add("dept-free-row");
      }
    });
  }

  // Show alert dialog
  showAlert(color, msg, alertDuration) {
    this.clearAlert();
    const alertDiv = document.createElement("div");
    alertDiv.className = "alertDiv";
    alertDiv.style.padding = ".5rem 1rem";
    alertDiv.style.background = color;
    alertDiv.style.color = "#fff";
    const text = document.createTextNode(msg);
    alertDiv.append(text);
    const parent = document.getElementById("add-patient-sidebar");
    const innerChild = document.querySelector("#add-patient-sidebar-wrapper");
    parent.insertBefore(alertDiv, innerChild);
    setTimeout(() => {
      this.clearAlert();
    }, alertDuration);
  }

  // Remove alert dialog
  clearAlert() {
    if (document.querySelector(".alertDiv")) {
      document.querySelector(".alertDiv").remove();
    }
  }

  // Hide the sidebar
  closeSideBar() {
    const sidebar = document.querySelector(
      "#main-wrapper #add-patient-sidebar"
    );
    sidebar.style.right = "-400px";
  }

  // Show the sidebar
  showSideBar() {
    const sidebar = document.querySelector(
      "#main-wrapper #add-patient-sidebar"
    );
    sidebar.style.right = "0";
  }
}
