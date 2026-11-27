const header = document.querySelector(".site-header");
const footer = document.querySelector("[data-site-footer]");

const textSizeControls = document.querySelectorAll("[data-text-size]");

if (textSizeControls.length) {
    const storageKey = "ekal-mahila-text-scale";
    const storedScale = Number(window.localStorage.getItem(storageKey));
    let textScale = Number.isFinite(storedScale) && storedScale >= 0.8 && storedScale <= 1.3 ? storedScale : 1;
    const textElements = Array.from(document.body.querySelectorAll("*")).filter((element) =>
        Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
        /^(INPUT|SELECT|TEXTAREA)$/.test(element.tagName)
    );
    const baseFontSizes = new Map(textElements.map((element) => [element, parseFloat(window.getComputedStyle(element).fontSize)]));

    const applyTextScale = () => {
        baseFontSizes.forEach((fontSize, element) => {
            element.style.fontSize = `${fontSize * textScale}px`;
        });
    };

    textSizeControls.forEach((control) => {
        control.addEventListener("click", () => {
            if (control.dataset.textSize === "increase") {
                textScale = Math.min(1.3, Math.round((textScale + 0.1) * 10) / 10);
            } else if (control.dataset.textSize === "decrease") {
                textScale = Math.max(0.8, Math.round((textScale - 0.1) * 10) / 10);
            } else {
                textScale = 1;
            }
            window.localStorage.setItem(storageKey, String(textScale));
            applyTextScale();
        });
    });

    applyTextScale();
}

if (header && !header.innerHTML.trim()) {
    const registrationPage = window.location.pathname.endsWith("registration.html");
    header.innerHTML = `
        <div class="header-top">
            <div class="container header-top-inner">
                <a class="brand" href="index.html" aria-label="योजना का मुखपृष्ठ">
                    <span class="brand-mark" aria-hidden="true"><img src="assets/images/uk_logo.jpeg" alt="उत्तराखंड सरकार" loading="eager"></span>
                    <span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>मुख्यमंत्री एकल महिला स्वरोजगार योजना</small></span>
                </a>
                <div class="header-actions">
                    <a class="header-help" href="index.html#help"><span class="header-help-icon" aria-hidden="true">?</span><span>सहायता</span></a>
                    <a class="header-apply${registrationPage ? " header-apply-current" : ""}" href="registration.html">${registrationPage ? "फॉर्म भर रहे हैं" : "आवेदन करें"} <span aria-hidden="true">→</span></a>
                </div>
                <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" data-menu-toggle><span></span><span></span><span></span><b>मेन्यू</b></button>
            </div>
        </div>`;
} else if (header) {
    const registrationPage = window.location.pathname.endsWith("registration.html");
    const applyBtn = header.querySelector(".header-apply");
    if (applyBtn) {
        applyBtn.classList.toggle("header-apply-current", registrationPage);
        applyBtn.innerHTML = `${registrationPage ? "फॉर्म भर रहे हैं" : "आवेदन करें"} <span aria-hidden="true">→</span>`;
    }
}

if (footer) {
    footer.innerHTML = `
        <div class="container footer-inner">
            <a class="brand brand-footer" href="index.html"><span class="brand-mark" aria-hidden="true"><img src="assets/images/uk_logo.jpeg" alt="उत्तराखंड सरकार" loading="lazy"></span><span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>एकल महिला स्वरोजगार योजना</small></span></a>
            <p>मुख्यमंत्री एकल महिला स्वरोजगार योजना<br><span>योजना जानकारी एवं आवेदन प्रारूप</span></p>
            <a class="footer-top" href="#main-content">पृष्ठ के शीर्ष पर ↑</a>
        </div>`;
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navBar = document.querySelector(".header-nav-bar");

if (menuToggle && navigation && navBar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        navBar.classList.toggle("navigation-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            menuToggle.setAttribute("aria-expanded", "false");
            navBar.classList.remove("navigation-open");
        }
    });
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-go-to]"));
    let activeSlide = 0;

    const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.classList.toggle("slide-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeSlide;
            dot.classList.toggle("is-current", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });
    };

    carousel.querySelector("[data-previous]").addEventListener("click", () => showSlide(activeSlide - 1));
    carousel.querySelector("[data-next]").addEventListener("click", () => showSlide(activeSlide + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => showSlide(Number(dot.dataset.goTo))));
}

const form = document.querySelector("#application-form");

if (form) {
    const singlePage = form.hasAttribute("data-single-page");
    const steps = Array.from(form.querySelectorAll("[data-form-step]"));
    const indicators = Array.from(form.querySelectorAll("[data-step-indicator]"));
    const previousButton = form.querySelector("[data-previous-step]");
    const nextButton = form.querySelector("[data-next-step]");
    const submitButton = form.querySelector("[data-submit-application]");
    const stepCount = form.querySelector("[data-step-count]");
    const message = form.querySelector("[data-submission-message]");
    const fundsDetails = form.querySelector("[data-funds-details]");
    const pensionDetailsInput = form.elements.namedItem("pensionDetails");
    const applicationProjectCost = form.elements.namedItem("applicationProjectCost");
    const applicationSupportAmount = form.elements.namedItem("applicationSupportAmount");
    let currentStep = 0;

    const updateFormStep = (index) => {
        if (singlePage) {
            steps.forEach((step) => {
                step.hidden = false;
                step.classList.add("is-visible");
            });
            return;
        }
        currentStep = index;
        steps.forEach((step, stepIndex) => {
            const isCurrent = stepIndex === currentStep;
            step.hidden = !isCurrent;
            step.classList.toggle("is-visible", isCurrent);
        });
        indicators.forEach((indicator, stepIndex) => {
            indicator.classList.toggle("is-current", stepIndex === currentStep);
            indicator.classList.toggle("is-complete", stepIndex < currentStep);
            if (stepIndex === currentStep) {
                indicator.setAttribute("aria-current", "step");
            } else {
                indicator.removeAttribute("aria-current");
            }
        });
        previousButton.hidden = currentStep === 0;
        nextButton.hidden = currentStep === steps.length - 1;
        submitButton.hidden = currentStep !== steps.length - 1;
        stepCount.textContent = `चरण ${currentStep + 1} / ${steps.length}`;
        message.hidden = true;
    };

    const validateStep = (stepIndex) => {
        const fields = Array.from(steps[stepIndex].querySelectorAll("input, select, textarea"));
        const invalidField = fields.find((field) => !field.checkValidity());
        if (invalidField) {
            invalidField.reportValidity();
            invalidField.focus();
            return false;
        }
        return true;
    };

    const updateApplicationCostValidity = () => {
        const cost = Number(applicationProjectCost.value);
        const support = Number(applicationSupportAmount.value);
        applicationSupportAmount.setCustomValidity(
            support > cost ? "सहयोग धनराशि की मांग कुल प्रस्तावित लागत से अधिक नहीं हो सकती।" : ""
        );
    };

    const updateConditionalFields = () => {
        const fundsReceived = form.querySelector('input[name="otherDepartmentFunds"]:checked')?.value === "हाँ";
        fundsDetails.hidden = !fundsReceived;
        ["otherDepartmentName", "otherDepartmentAmount"].forEach((name) => {
            form.elements.namedItem(name).required = fundsReceived;
        });

        const conditionalUploads = [
            { name: "pensionDetails", required: pensionDetailsInput.value.trim() !== "" },
            { name: "notarizedDeclaration", required: form.querySelector('input[name="notarizedDeclaration"]:checked')?.value === "हाँ" },
            { name: "noDoubleBenefitDeclaration", required: form.querySelector('input[name="noDoubleBenefitDeclaration"]:checked')?.value === "हाँ" }
        ];
        conditionalUploads.forEach(({ name, required }) => {
            const field = form.querySelector(`[data-conditional-upload="${name}"]`);
            const upload = field.querySelector('input[type="file"]');
            field.hidden = !required;
            upload.required = required;
            field.classList.toggle("conditional-upload-required", required);
        });
    };

    form.querySelectorAll("[data-file-name]").forEach((input) => {
        const note = input.closest(".upload-field").querySelector("[data-file-label]");
        input.addEventListener("change", () => {
            const file = input.files[0];
            input.setCustomValidity("");
            if (file && file.size > 5 * 1024 * 1024) {
                input.setCustomValidity("फाइल का आकार 5 MB से कम रखें।");
                note.textContent = "फाइल 5 MB से बड़ी है। छोटी फाइल चुनें।";
                note.classList.add("file-error");
                return;
            }
            note.classList.remove("file-error");
            note.textContent = file ? file.name : "PDF, JPG या PNG · अधिकतम 5 MB";
        });
    });

    form.addEventListener("change", (event) => {
        if (event.target.name === "otherDepartmentFunds" || event.target.name === "notarizedDeclaration" || event.target.name === "noDoubleBenefitDeclaration" || event.target.name === "pensionDetails") {
            updateConditionalFields();
        }
    });

    pensionDetailsInput.addEventListener("input", updateConditionalFields);
    [applicationProjectCost, applicationSupportAmount].forEach((input) => {
        input.addEventListener("input", updateApplicationCostValidity);
    });

    if (!singlePage) {
        nextButton.addEventListener("click", () => {
            if (currentStep === 1) {
                updateConditionalFields();
            }
            if (validateStep(currentStep)) {
                updateFormStep(currentStep + 1);
                form.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        previousButton.addEventListener("click", () => {
            updateFormStep(currentStep - 1);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateConditionalFields();
        updateApplicationCostValidity();
        const incompleteStep = steps.findIndex((step) =>
            Array.from(step.querySelectorAll("input, select, textarea")).some((field) => !field.checkValidity())
        );
        if (incompleteStep !== -1) {
            if (!singlePage) {
                updateFormStep(incompleteStep);
            }
            validateStep(incompleteStep);
            return;
        }
        message.innerHTML = `<strong>आपका आवेदन प्रारूप पूरा है।</strong><p>यह डेमो किसी सरकारी ऑनलाइन सबमिशन सेवा से जुड़ा नहीं है। आपका आवेदन या दस्तावेज कहीं भेजे नहीं गए हैं। आवेदन जमा करने के लिए संबंधित विभाग से संपर्क करें।</p><button class="print-button" type="button" data-print-application>इस पृष्ठ को प्रिंट करें</button>`;
        message.hidden = false;
        message.querySelector("[data-print-application]").addEventListener("click", () => window.print());
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            form.querySelectorAll("[data-file-name]").forEach((input) => {
                input.setCustomValidity("");
                const note = input.closest(".upload-field").querySelector("[data-file-label]");
                note.classList.remove("file-error");
                note.textContent = "PDF, JPG या PNG · अधिकतम 5 MB";
            });
            updateConditionalFields();
            updateApplicationCostValidity();
            message.hidden = true;
        }, 0);
    });

    updateConditionalFields();
    updateFormStep(0);
}

const registrationForm = document.querySelector("#registration-form");

if (registrationForm) {
    const message = registrationForm.querySelector("[data-registration-message]");

    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const invalidField = Array.from(registrationForm.elements).find(
            (field) => field.willValidate && !field.checkValidity()
        );
        if (invalidField) {
            invalidField.reportValidity();
            invalidField.focus();
            return;
        }

        message.textContent = "यह डेमो प्रारूप है। आपकी जानकारी जमा या कहीं भेजी नहीं गई है।";
        message.hidden = false;
    });

    registrationForm.addEventListener("reset", () => {
        message.hidden = true;
        message.textContent = "";
    });
}

const businessForm = document.querySelector("#business-details-form");

if (businessForm) {
    const mainApplicantName = document.querySelector('#application-form [name="fullName"]');
    const businessApplicantName = businessForm.elements.namedItem("businessApplicantName");
    const rentDetails = businessForm.querySelector("[data-rent-details]");
    const bankLoanDetails = businessForm.querySelector("[data-bank-loan-details]");
    const projectCostInput = businessForm.elements.namedItem("projectCost");
    const supportAmountInput = businessForm.elements.namedItem("supportAmount");
    const contributionInput = businessForm.elements.namedItem("contribution");
    const contributionNote = businessForm.querySelector("[data-contribution-note]");
    const materialCostInputs = Array.from(businessForm.querySelectorAll("[data-material-cost]"));
    const materialTotal = businessForm.querySelector("[data-material-total]");
    const message = businessForm.querySelector("[data-business-submission-message]");

    const updateBusinessApplicantName = () => {
        businessApplicantName.value = mainApplicantName.value;
    };

    const updateMaterialTotal = () => {
        const total = materialCostInputs.reduce((sum, input) => sum + (Number(input.value) || 0), 0);
        materialTotal.textContent = total.toLocaleString("en-IN");
    };

    const updateConditionalFields = () => {
        const rentedWorkplace = businessForm.querySelector('input[name="workplaceType"]:checked')?.value === "किराये का";
        rentDetails.hidden = !rentedWorkplace;
        businessForm.elements.namedItem("annualRent").required = rentedWorkplace;

        const bankLoan = businessForm.querySelector('input[name="contributionSource"]:checked')?.value === "बैंक ऋण";
        bankLoanDetails.hidden = !bankLoan;
        businessForm.elements.namedItem("bankLoanDetails").required = bankLoan;
    };

    const updateProjectValidity = () => {
        const projectCost = Number(projectCostInput.value);
        const supportAmount = Number(supportAmountInput.value);
        const contribution = Number(contributionInput.value);
        const projectError = supportAmount > projectCost
            ? "मांगी गई सहायता परियोजना की कुल लागत से अधिक नहीं हो सकती।"
            : "";
        const contributionError = projectCost > 0 && contribution < projectCost * 0.25
            ? `लाभार्थी का अंशदान कम-से-कम ₹${Math.ceil(projectCost * 0.25).toLocaleString("en-IN")} होना चाहिए।`
            : "";

        supportAmountInput.setCustomValidity(projectError);
        contributionInput.setCustomValidity(contributionError);
        contributionNote.textContent = projectCost > 0
            ? `इस लागत के लिए 25% अंशदान कम-से-कम ₹${Math.ceil(projectCost * 0.25).toLocaleString("en-IN")} होना चाहिए।`
            : "परियोजना लागत का कम-से-कम 25% लाभार्थी का योगदान होना चाहिए।";
    };

    businessForm.addEventListener("change", (event) => {
        if (event.target.name === "workplaceType" || event.target.name === "contributionSource") {
            updateConditionalFields();
        }
    });
    mainApplicantName.addEventListener("input", updateBusinessApplicantName);
    materialCostInputs.forEach((input) => input.addEventListener("input", updateMaterialTotal));
    [projectCostInput, contributionInput, supportAmountInput].forEach((input) => {
        input.addEventListener("input", updateProjectValidity);
    });

    businessForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateConditionalFields();
        updateProjectValidity();
        if (!businessForm.checkValidity()) {
            businessForm.reportValidity();
            return;
        }
        message.innerHTML = "<strong>व्यवसाय विवरण प्रारूप पूरा है।</strong><p>यह डेमो किसी सरकारी ऑनलाइन सबमिशन सेवा से जुड़ा नहीं है। आपका विवरण कहीं भेजा नहीं गया है।</p>";
        message.hidden = false;
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    businessForm.addEventListener("reset", () => {
        window.setTimeout(() => {
            updateBusinessApplicantName();
            updateMaterialTotal();
            updateConditionalFields();
            updateProjectValidity();
            message.hidden = true;
        }, 0);
    });

    updateBusinessApplicantName();
    updateMaterialTotal();
    updateConditionalFields();
    updateProjectValidity();
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
    const sendOtpBtn = loginForm.querySelector("#send-otp-btn");
    const loginSubmitBtn = loginForm.querySelector("#login-submit-btn");
    const message = loginForm.querySelector("[data-login-message]");
    let otpSent = false;
    let otpTimer = null;

    const showMessage = (html, isError = false) => {
        message.innerHTML = html;
        message.hidden = false;
        message.classList.toggle("error", isError);
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const startOtpTimer = () => {
        let seconds = 300;
        sendOtpBtn.disabled = true;
        sendOtpBtn.innerHTML = `<i class="fa-solid fa-clock" aria-hidden="true"></i> ${seconds}s`;
        otpTimer = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(otpTimer);
                sendOtpBtn.disabled = false;
                sendOtpBtn.innerHTML = `<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> OTP भेजें`;
            } else {
                sendOtpBtn.innerHTML = `<i class="fa-solid fa-clock" aria-hidden="true"></i> ${seconds}s`;
            }
        }, 1000);
    };

    const validateMobile = (mobile) => {
        return /^[6-9][0-9]{9}$/.test(mobile);
    };

    const validateOtp = (otp) => {
        return /^\d{6}$/.test(otp);
    };

    sendOtpBtn.addEventListener("click", () => {
        const mobile = loginForm.elements.namedItem("mobile").value.trim();
        if (!validateMobile(mobile)) {
            loginForm.elements.namedItem("mobile").reportValidity();
            loginForm.elements.namedItem("mobile").focus();
            return;
        }
        otpSent = true;
        startOtpTimer();
        showMessage(`<strong>OTP भेजा गया!</strong><p>मोबाइल नंबर <b>${mobile}</b> पर 6 अंकों का OTP भेजा गया है। कृपया OTP दर्ज करें।</p>`, false);
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const mobile = loginForm.elements.namedItem("mobile").value.trim();
        const otp = loginForm.elements.namedItem("otp").value.trim();

        if (!validateMobile(mobile)) {
            loginForm.elements.namedItem("mobile").reportValidity();
            loginForm.elements.namedItem("mobile").focus();
            return;
        }
        if (!validateOtp(otp)) {
            loginForm.elements.namedItem("otp").reportValidity();
            loginForm.elements.namedItem("otp").focus();
            return;
        }

        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> लॉगिन हो रहा है...`;

        setTimeout(() => {
            if (otp === "123456") {
                showMessage(`<strong>लॉगिन सफल!</strong><p>आपका स्वागत है। आवेदन फॉर्म पर पुनर्निर्देशित किया जा रहा है...</p>`, false);
                setTimeout(() => {
                    window.location.href = "registration.html";
                }, 1500);
            } else {
                showMessage(`<strong>गलत OTP!</strong><p>दर्ज किया गया OTP सही नहीं है। कृपया सही OTP दर्ज करें।</p>`, true);
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> लॉगिन`;
            }
        }, 1000);
    });

    loginForm.addEventListener("reset", () => {
        if (otpTimer) {
            clearInterval(otpTimer);
            otpTimer = null;
        }
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerHTML = `<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> OTP भेजें`;
        message.hidden = true;
        message.classList.remove("error");
        otpSent = false;
    });
}

const heroCarousel = document.querySelector(".hero-photo-carousel");

if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(heroCarousel.querySelectorAll("[data-go-to]"));
    let activeSlide = 0;
    let timer;

    const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.classList.toggle("slide-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeSlide;
            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-selected", String(isActive));
            dot.setAttribute("aria-pressed", String(isActive));
        });
    };

    const start = () => {
        clearInterval(timer);
        timer = setInterval(() => showSlide(activeSlide + 1), 2000);
    };
    const stop = () => clearInterval(timer);

    dots.forEach((dot) => dot.addEventListener("click", () => {
        stop();
        showSlide(Number(dot.dataset.goTo));
        start();
    }));

    heroCarousel.addEventListener("mouseenter", stop);
    heroCarousel.addEventListener("mouseleave", start);

    start();
}