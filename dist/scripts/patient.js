class Patient {
  constructor(name, mobile) {
    this.name = name;
    this.mobile = mobile;
    this.meds = null;
    this.deptAmount = null;
    this.date = this.dateAttended();
    this.totalMedsAmount = null;
  }

  dateAttended() {
    const d = new Date();

    const dtf = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(
      d
    );

    return `${da} / ${mo} / ${ye}`;
  }

  calculateTotalMedsAmount() {
    if (this.meds !== null) {
      return this.meds
        .map((med) => med.price)
        .reduce((sum, current) => sum + current, 0)
        .toFixed(2);
    }
  }
}
