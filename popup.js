document.addEventListener("DOMContentLoaded", function () {
  const advancedDetailsBtn = document.getElementById("advancedDetailsBtn");
  const advancedDetailsForm = document.getElementById("advancedDetailsForm");

  // Toggle Advanced Details Form
  advancedDetailsBtn.addEventListener("click", function () {
      advancedDetailsForm.classList.toggle("hidden");
  });

  document.getElementById("calculate").addEventListener("click", function () {
      let salary = parseFloat(document.getElementById("salary").value);
      let state = document.getElementById("state").value;

      if (isNaN(salary) || salary <= 0) {
          document.getElementById("result").innerHTML = "<p class='error'>Please enter a valid salary.</p>";
          return;
      }

      if (!state) {
          document.getElementById("result").innerHTML = "<p class='error'>Please select a state.</p>";
          return;
      }

      // Define old and new tax slab calculations
      let oldTax = calculateOldTax(salary);
      let newTax = calculateNewTax(salary);

      // Calculate additional components
      let educationCess = calculateEducationCess(oldTax, newTax);
      let healthAndEducationCess = calculateHealthAndEducationCess(oldTax, newTax);
      let professionalTax = calculateProfessionalTax(salary, state);
      let otherDeductions = calculateOtherDeductions();

      // Calculate total tax with additional components
      let totalOldTax = oldTax + educationCess.old + healthAndEducationCess.old + professionalTax + otherDeductions;
      let totalNewTax = newTax + educationCess.new + healthAndEducationCess.new + professionalTax + otherDeductions;

      let savings = totalOldTax - totalNewTax;

      // Display results with a divider
      document.getElementById("result").innerHTML = `
          <h3>Old Tax Slab Details</h3>
          <p>Old Tax: ₹${oldTax.toLocaleString()}</p>
          <p>Education Cess (Old): ₹${educationCess.old.toLocaleString()}</p>
          <p>Health and Education Cess (Old): ₹${healthAndEducationCess.old.toLocaleString()}</p>
          <p>Professional Tax: ₹${professionalTax.toLocaleString()}</p>
          <p>Other Deductions: ₹${otherDeductions.toLocaleString()}</p>
          <p><strong>Total Old Tax: ₹${totalOldTax.toLocaleString()}</strong></p>

          <div class="divider"></div>

          <h3>New Tax Slab Details</h3>
          <p>New Tax: ₹${newTax.toLocaleString()}</p>
          <p>Education Cess (New): ₹${educationCess.new.toLocaleString()}</p>
          <p>Health and Education Cess (New): ₹${healthAndEducationCess.new.toLocaleString()}</p>
          <p>Professional Tax: ₹${professionalTax.toLocaleString()}</p>
          <p>Other Deductions: ₹${otherDeductions.toLocaleString()}</p>
          <p><strong>Total New Tax: ₹${totalNewTax.toLocaleString()}</strong></p>

          <div class="divider"></div>

          <p class="savings">Total Savings: ₹${savings.toLocaleString()}</p>
      `;
  });
});

function calculateOldTax(salary) {
  if (salary <= 700000) return 0;
  else if (salary <= 1000000) return (salary - 700000) * 0.1;
  else if (salary <= 1500000) return 30000 + (salary - 1000000) * 0.2;
  else return 130000 + (salary - 1500000) * 0.3;
}

function calculateNewTax(salary) {
  if (salary <= 1280000) return 0;
  else if (salary <= 1500000) return (salary - 1280000) * 0.1;
  else return 22000 + (salary - 1500000) * 0.2;
}

function calculateEducationCess(oldTax, newTax) {
  // Education Cess is typically 2% of the tax amount
  return {
      old: oldTax * 0.02,
      new: newTax * 0.02
  };
}

function calculateHealthAndEducationCess(oldTax, newTax) {
  // Health and Education Cess is typically 1% of the tax amount
  return {
      old: oldTax * 0.01,
      new: newTax * 0.01
  };
}

function calculateProfessionalTax(salary, state) {
  // Professional Tax varies by state
  const professionalTaxRates = {
      "andhra-pradesh": 2500, // Andhra Pradesh
      "bihar": 2500,          // Bihar
      "delhi": 0,             // Delhi has no professional tax
      "gujarat": 2400,        // Gujarat
      "karnataka": 2400,      // Karnataka
      "kerala": 2500,         // Kerala
      "maharashtra": 2500,    // Maharashtra
      "odisha": 2000,         // Odisha
      "punjab": 2000,         // Punjab
      "tamil-nadu": 2600,     // Tamil Nadu
      "telangana": 2500,      // Telangana
      "uttar-pradesh": 2500,  // Uttar Pradesh
      "west-bengal": 2500,    // West Bengal
      "other": 2000           // Default for other states
  };
  return professionalTaxRates[state] || 0;
}

function calculateOtherDeductions() {
  // Fetch values from Advanced Details Form
  const hra = parseFloat(document.getElementById("hra").value) || 0;
  const standardDeduction = parseFloat(document.getElementById("standardDeduction").value) || 0;
  const otherDeductions = parseFloat(document.getElementById("otherDeductions").value) || 0;

  // Total Other Deductions
  return hra + standardDeduction + otherDeductions;
}