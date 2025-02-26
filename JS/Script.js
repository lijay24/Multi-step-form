document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".stp");
    const stepIndicators = document.querySelectorAll(".step");
    const nextButtons = document.querySelectorAll(".next-step");
    const prevButtons = document.querySelectorAll(".prev-step");
    const formInputs = document.querySelectorAll(".stp input");
    const planCards = document.querySelectorAll(".plan-card");
    const switcher = document.querySelector(".switch input");
    const addons = document.querySelectorAll(".box input");
    const totalPrice = document.querySelector(".total b");

    let currentStep = 0;
    let selectedPlan = { name: "", type: "monthly", price: 0 };
    let selectedAddons = [];

    function updateStepDisplay() {
        steps.forEach((step, index) => {
            step.style.display = index === currentStep ? "block" : "none";
        });

        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentStep);
        });
    }

    function validateForm() {
        let isValid = true;
        const activeStepInputs = steps[currentStep].querySelectorAll("input");

        activeStepInputs.forEach(input => {
            let errorText = input.nextElementSibling;
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add("err");
                if (!errorText || !errorText.classList.contains("error-msg")) {
                    errorText = document.createElement("span");
                    errorText.classList.add("error-msg");
                    errorText.innerText = "This field is required!";
                    input.parentNode.appendChild(errorText);
                }
            } else {
                input.classList.remove("err");
                if (errorText && errorText.classList.contains("error-msg")) {
                    errorText.remove();
                }
            }
        });

        return isValid;
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (validateForm() && currentStep < steps.length - 1) {
                currentStep++;
                updateStepDisplay();
                updateSummary();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepDisplay();
            }
        });
    });

    planCards.forEach(plan => {
        plan.addEventListener("click", () => {
            document.querySelector(".plan-card.selected")?.classList.remove("selected");
            plan.classList.add("selected");
            selectedPlan.name = plan.querySelector("b").innerText;
            selectedPlan.price = parseInt(plan.querySelector(".plan-price").innerText.replace(/\D/g, ""));
            updateTotal();
        });
    });

    switcher.addEventListener("change", () => {
        selectedPlan.type = switcher.checked ? "yearly" : "monthly";
        updateTotal();
    });

    addons.forEach(addon => {
        addon.addEventListener("change", () => {
            if (addon.checked) {
                selectedAddons.push({ name: addon.dataset.name, price: parseInt(addon.dataset.price) });
            } else {
                selectedAddons = selectedAddons.filter(a => a.name !== addon.dataset.name);
            }
            updateTotal();
        });
    });

    function updateTotal() {
        let total = selectedPlan.price;
        selectedAddons.forEach(addon => total += addon.price);
        totalPrice.innerText = `$${total}/${selectedPlan.type === "yearly" ? "yr" : "mo"}`;
    }

    function updateSummary() {
        const planNameEl = document.querySelector(".plan-name");
        const planPriceEl = document.querySelector(".plan-price");

        if (planNameEl && planPriceEl) {
            planNameEl.innerText = `${selectedPlan.name} (${selectedPlan.type})`;
            planPriceEl.innerText = `$${selectedPlan.price}`;
        }
    }

    updateStepDisplay();
});
