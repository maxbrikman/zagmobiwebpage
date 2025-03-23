/**
 * ZagMobi Website Scripts
 * Hauptskript für die ZagMobi-Webseite
 */

// Material Design-Komponenten initialisieren
document.addEventListener('DOMContentLoaded', function() {
    // Ripple-Effekt für Buttons initialisieren
    const rippleElements = document.querySelectorAll('.mdc-button');
    rippleElements.forEach(element => {
        mdc.ripple.MDCRipple.attachTo(element);
    });

    // Text Felder initialisieren
    const textFieldElements = document.querySelectorAll('.mdc-text-field');
    textFieldElements.forEach(element => {
        mdc.textField.MDCTextField.attachTo(element);
    });

    // Smooth Scrolling für Navigation
    setupSmoothScrolling();

    // Aktiven Menüpunkt basierend auf Scroll-Position markieren
    setupScrollSpy();

    // Kontaktformular-Validierung
    setupFormValidation();
});

/**
 * Smooth Scrolling für Anker-Links einrichten
 */
function setupSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const headerOffset = 80; // Höhe des Headers + etwas Padding
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Aktiven Navigation-Link aktualisieren
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

/**
 * ScrollSpy für Navigation einrichten
 * Markiert den aktiven Menüpunkt basierend auf der aktuellen Scroll-Position
 */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY;
        const headerOffset = 100; // Etwas mehr als Header-Höhe

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Formularvalidierung für das Kontaktformular
 */
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Einfache Validierung
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            let isValid = true;
            let errorMessage = '';

            if (!name) {
                isValid = false;
                errorMessage += 'Bitte geben Sie Ihren Namen ein.\n';
            }

            if (!email) {
                isValid = false;
                errorMessage += 'Bitte geben Sie Ihre E-Mail-Adresse ein.\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Bitte geben Sie eine gültige E-Mail-Adresse ein.\n';
            }

            if (!subject) {
                isValid = false;
                errorMessage += 'Bitte geben Sie einen Betreff ein.\n';
            }

            if (!message) {
                isValid = false;
                errorMessage += 'Bitte geben Sie eine Nachricht ein.\n';
            }

            if (!isValid) {
                alert('Bitte korrigieren Sie die folgenden Fehler:\n\n' + errorMessage);
                return;
            }

            // Hier würde normalerweise der Ajax-Request zum Senden des Formulars stehen
            // Für diese Demo zeigen wir nur eine Erfolgsmeldung
            showFormSuccess();
        });
    }
}

/**
 * Prüft, ob eine E-Mail-Adresse gültig ist
 * @param {string} email - Die zu prüfende E-Mail-Adresse
 * @returns {boolean} - True, wenn die E-Mail gültig ist, sonst False
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Zeigt eine Erfolgsmeldung nach dem Absenden des Formulars an
 */
function showFormSuccess() {
    const contactForm = document.getElementById('contact-form');
    const formFields = contactForm.querySelectorAll('input, textarea');

    // Formular zurücksetzen
    formFields.forEach(field => {
        field.value = '';
    });

    // Erfolgsmeldung anzeigen (hier könnte ein Toast oder eine Meldung eingefügt werden)
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
}

/**
 * Aktuelles Datum im Footer aktualisieren
 */
function updateCopyrightYear() {
    const copyright = document.querySelector('.copyright p:first-child');
    if (copyright) {
        const currentYear = new Date().getFullYear();
        copyright.textContent = copyright.textContent.replace(/\d{4}/, currentYear);
    }
}

// Copyright-Jahr beim Laden aktualisieren
updateCopyrightYear();

/**
 * Echtzeit-Updates für die Linien simulieren
 * In einer realen Anwendung würden diese Daten von einer API kommen
 */
function simulateLineUpdates() {
    const statusElements = document.querySelectorAll('.route-status');
    const statusTypes = ['status-active', 'status-delayed', 'status-planned'];
    const statusText = ['Aktiv', 'Verspätet', 'Geplant'];

    // Aktuelle Zeiten für die Abfahrtsliste
    updateDepartureCountdown();

    // Nur zur Demonstration: Zufällige Status-Updates alle 30 Sekunden
    setInterval(() => {
        // Eine zufällige Linie auswählen (nicht alle werden aktualisiert)
        if (Math.random() > 0.7) {
            const randomLine = Math.floor(Math.random() * statusElements.length);
            const randomStatus = Math.floor(Math.random() * statusTypes.length);

            const statusElement = statusElements[randomLine];

            // ICE-Linien immer als "Geplant" belassen
            if (statusElement.previousElementSibling.querySelector('.route-name').textContent.includes('ICE')) {
                return;
            }

            // Alten Status entfernen
            statusTypes.forEach(type => {
                statusElement.classList.remove(type);
            });

            // Neuen Status setzen
            statusElement.classList.add(statusTypes[randomStatus]);
            statusElement.textContent = statusText[randomStatus];
        }

        // Countdown für Abfahrten aktualisieren
        updateDepartureCountdown();
    }, 30000);
}

/**
 * Aktualisiert die Countdown-Anzeige in der Abfahrtsliste
 */
function updateDepartureCountdown() {
    const departureItems = document.querySelectorAll('.departure-item');
    if (!departureItems.length) return;

    departureItems.forEach(item => {
        const timeLeft = item.querySelector('.time-left');
        if (!timeLeft) return;

        // Aktuellen Text auslesen
        const currentText = timeLeft.textContent;

        // Nur für "in X min" Einträge, nicht für "+X min" (Verspätungen)
        if (currentText.includes('in ')) {
            const minutes = parseInt(currentText.replace('in ', '').replace(' min', ''));
            if (isNaN(minutes)) return;

            // Zeit reduzieren (simuliert)
            const newMinutes = Math.max(0, minutes - 1);

            // Text aktualisieren
            if (newMinutes === 0) {
                timeLeft.textContent = 'jetzt';
                item.style.backgroundColor = 'rgba(0, 150, 0, 0.1)';
            } else {
                timeLeft.textContent = `in ${newMinutes} min`;
            }
        }
    });
}

/**
 * Registrierung für Fernverkehr-Updates einrichten
 */
function setupICERegistration() {
    // Button in der Fernverkehr-Ankündigung
    const registerButton = document.querySelector('.coming-soon-section .primary-button');

    if (registerButton) {
        registerButton.addEventListener('click', () => {
            // Einfaches Modal anzeigen (könnte später durch eine richtige Formularerfassung ersetzt werden)
            const email = prompt('Bitte geben Sie Ihre E-Mail-Adresse ein, um Updates zu unseren kommenden Fernverkehrsverbindungen zu erhalten:');

            if (email && isValidEmail(email)) {
                alert(`Vielen Dank! Wir werden Sie unter ${email} über unsere neuen IC/ICE-Verbindungen auf dem Laufenden halten.`);
            } else if (email) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            }
        });
    }
}

// In einer realen Anwendung würde diese Funktion aktiviert werden
// Für die Demo ist sie deaktiviert
// simulateLineUpdates();