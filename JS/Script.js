const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");

let time;
let currentStep = 1;
let currentCircle = 0;

const obj = {
  plan: null,
  kind: null,
  price: null,
};

// Step Navigation
steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-step");
  const prevBtn = step.querySelector(".prev-step");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentStep < 5 && validateForm()) {
        document.querySelector(`.step-${currentStep}`).style.display = "none";
        currentStep++;
        currentCircle++;
        document.querySelector(`.step-${currentStep}`).style.display = "flex";
        circleSteps[currentCircle].classList.add("active");
        setTotal();
        summary(obj);
      }
    });
  }
});

// Form Validation
function validateForm() {
  let valid = true;
  formInputs.forEach((input) => {
    if (!input.value) {
      valid = false;
      input.classList.add("err");
      findLabel(input).nextElementSibling.style.display = "flex";
    } else {
      input.classList.remove("err");
      findLabel(input).nextElementSibling.style.display = "none";
    }
  });
  return valid;
}

// Find Label for Input
function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let label of labels) {
    if (label.htmlFor === idVal) return label;
  }
}

// Plan Selection
plans.forEach((plan) => {
  plan.addEventListener("click", () => {
    document.querySelector(".selected")?.classList.remove("selected");
    plan.classList.add("selected");
    const planName = plan.querySelector("b");
    const planPrice = plan.querySelector(".plan-price");
    obj.plan = planName;
    obj.price = planPrice;
  });
});

// Switcher (Monthly/Yearly)
switcher.addEventListener("click", () => {
  const val = switcher.querySelector("input").checked;
  document.querySelector(".monthly").classList.toggle("tx-active", !val);
  document.querySelector(".yearly").classList.toggle("tx-active", val);
  switchPrice(val);
  obj.kind = val;
});

// Add-ons Selection
addons.forEach((addon) => {
    const addonSelect = addon.querySelector("input");
    addon.addEventListener("click", (e) => {
      if (e.target !== addonSelect) {
        addonSelect.checked = !addonSelect.checked;
      }
      addon.classList.toggle("ad-selected", addonSelect.checked);
      updateAddonsInSummary(addon, addonSelect.checked);
      setTotal(); 
    });
  });
  
  // Update Add-ons in Summary
  function updateAddonsInSummary(ad, val) {
    const addonsContainer = document.querySelector(".address");
    const template = document.querySelector("template");
    const clone = template.content.cloneNode(true);
    const serviceName = clone.querySelector(".service-name");
    const servicePrice = clone.querySelector(".service-price");
    const serviceID = clone.querySelector(".selected-address");
  
    if (val) {
      // Add the add-on to the summary
      serviceName.innerText = ad.querySelector("label").innerText;
      servicePrice.innerText = ad.querySelector(".price").innerText;
      serviceID.setAttribute("data-id", ad.dataset.id);
      addonsContainer.appendChild(clone);
    } else {
      // Remove the add-on from the summary
      const addonsInSummary = document.querySelectorAll(".selected-address");
      addonsInSummary.forEach((addon) => {
        if (addon.getAttribute("data-id") === ad.dataset.id) {
          addon.remove();
        }
      });
    }
  }
  
  // Set Total Price
  function setTotal() {
    const planPriceStr = planPrice.innerHTML;
    const planPriceValue = Number(planPriceStr.replace(/\D/g, ""));
    const addonPrices = document.querySelectorAll(".selected-address .service-price");
  
    let addonsTotal = 0;
    addonPrices.forEach((addonPrice) => {
      const priceStr = addonPrice.innerHTML;
      const priceValue = Number(priceStr.replace(/\D/g, ""));
      addonsTotal += priceValue;
    });
  
    const totalPrice = planPriceValue + addonsTotal;
    total.innerHTML = `$${totalPrice}/${time ? "yr" : "mo"}`;
  }
// Set Time (Monthly/Yearly)
function setTime(t) {
  time = t;
}

// Summary
function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "yearly" : "monthly"})`;
}