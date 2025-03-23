/**
 * ZagMobi Tickets JavaScript
 * Funktionen für die Anzeige und Interaktion mit dem Ticketsystem
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ripple-Effekt für Buttons initialisieren
    const rippleElements = document.querySelectorAll('.mdc-button');
    rippleElements.forEach(element => {
        mdc.ripple.MDCRipple.attachTo(element);
    });

    // Tabs für Ticket-Typen einrichten
    setupTicketTabs();

    // Mengenauswahl einrichten
    setupQuantitySelectors();

    // Ticket-Kauf-Buttons einrichten
    setupTicketPurchase();

    // Ticket-Konfiguration-Modal einrichten
    setupTicketConfigModal();

    // Ticket-Erfolgs-Modal einrichten
    setupTicketSuccessModal();
});

/**
 * Tabs für die verschiedenen Ticket-Typen einrichten
 */
function setupTicketTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const ticketSections = document.querySelectorAll('.ticket-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Aktiven Tab markieren
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Entsprechende Sektion anzeigen
            const targetId = this.getAttribute('data-target');
            ticketSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Mengenauswahl für Tickets einrichten
 */
function setupQuantitySelectors() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');

    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
            }
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            let value = parseInt(input.value);
            input.value = value + 1;
        });
    });
}

/**
 * Ticket-Kauf-Buttons einrichten
 */
function setupTicketPurchase() {
    const buyButtons = document.querySelectorAll('.buy-ticket-btn');
    const ticketConfigModal = document.getElementById('ticketConfigModal');

    if (buyButtons.length && ticketConfigModal) {
        buyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const ticketName = this.getAttribute('data-ticket');
                const ticketPrice = this.getAttribute('data-price');
                const ticketType = this.getAttribute('data-type');
                const quantityInput = this.closest('.ticket-purchase').querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

                // Modal mit Ticketdaten füllen
                document.getElementById('selectedTicketName').textContent = ticketName;
                document.getElementById('selectedTicketType').textContent = ticketType;

                // Preis berechnen und anzeigen
                const totalPrice = (parseFloat(ticketPrice) * quantity).toFixed(2);
                document.getElementById('selectedTicketPrice').textContent = `${totalPrice} €`;
                document.getElementById('totalPriceDisplay').textContent = `${totalPrice} €`;

                // Aktuelles Datum als Standardwert setzen
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                document.getElementById('travel-date').value = formattedDate;

                // Modal anzeigen
                ticketConfigModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
    }
}

/**
 * Ticket-Konfiguration-Modal einrichten
 */
function setupTicketConfigModal() {
    const ticketConfigModal = document.getElementById('ticketConfigModal');
    const closeTicketConfigModal = document.getElementById('closeTicketConfigModal');
    const cancelTicketBtn = document.getElementById('cancelTicketBtn');
    const buyAndDownloadBtn = document.getElementById('buyAndDownloadBtn');
    const ticketSuccessModal = document.getElementById('ticketSuccessModal');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const creditCardForm = document.getElementById('creditCardForm');

    if (ticketConfigModal && closeTicketConfigModal && cancelTicketBtn && buyAndDownloadBtn) {
        // Schließen-Button
        closeTicketConfigModal.addEventListener('click', function() {
            ticketConfigModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Abbrechen-Button
        cancelTicketBtn.addEventListener('click', function() {
            ticketConfigModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Klick außerhalb des Modals
        ticketConfigModal.addEventListener('click', function(e) {
            if (e.target === ticketConfigModal) {
                ticketConfigModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Zahlungsmethoden-Auswahl
        if (paymentOptions.length && creditCardForm) {
            paymentOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const method = this.getAttribute('data-method');

                    // Aktive Klasse setzen
                    paymentOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');

                    // Ausgewählte Zahlungsmethode anzeigen
                    const selectedPaymentMethod = document.getElementById('selectedPaymentMethod');
                    let methodName = '';
                    let icon = '';

                    switch (method) {
                        case 'credit':
                            methodName = 'Kreditkarte';
                            icon = 'credit_card';
                            creditCardForm.style.display = 'block';
                            break;
                        case 'bank':
                            methodName = 'Lastschrift';
                            icon = 'account_balance';
                            creditCardForm.style.display = 'none';
                            break;
                        case 'paypal':
                            methodName = 'PayPal';
                            icon = 'smartphone';
                            creditCardForm.style.display = 'none';
                            break;
                    }

                    selectedPaymentMethod.innerHTML = `
                        <span class="material-icons">${icon}</span>
                        <span>${methodName}</span>
                    `;
                });
            });
        }

        // Kaufen & Herunterladen Button
        if (buyAndDownloadBtn && ticketSuccessModal) {
            buyAndDownloadBtn.addEventListener('click', function() {
                // In einer realen Anwendung würde hier die Zahlung verarbeitet werden

                // Daten aus dem Formular auslesen
                const passengerName = document.getElementById('passenger-name').value || 'Max Mustermann';
                const travelDate = document.getElementById('travel-date').value;
                const travelTime = document.getElementById('travel-time').value || '12:00';
                const startStop = document.getElementById('start-stop').value || 'Hauptbahnhof';
                const endStop = document.getElementById('end-stop').value || 'Universität';

                // Formatiertes Datum erstellen
                const dateObj = new Date(travelDate);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                const formattedDate = `${day}.${month}.${year}, ${travelTime} Uhr`;

                // Vorschau im Erfolgs-Modal aktualisieren
                document.getElementById('previewPassenger').textContent = passengerName;
                document.getElementById('previewRoute').textContent = `${startStop} → ${endStop}`;
                document.getElementById('previewDate').textContent = formattedDate;
                document.getElementById('previewPrice').textContent = document.getElementById('totalPriceDisplay').textContent;
                document.getElementById('previewTicketType').textContent = document.getElementById('selectedTicketName').textContent;

                // Zufällige Ticketnummer generieren
                const ticketNumber = 'ZAG-' + Math.floor(1000000000 + Math.random() * 9000000000);
                document.getElementById('previewTicketNumber').textContent = ticketNumber;

                // Konfigurationsmodal ausblenden und Erfolgsmodal einblenden
                ticketConfigModal.style.display = 'none';
                ticketSuccessModal.style.display = 'flex';

                // In einer realen Anwendung würde hier das Ticket als PDF heruntergeladen werden
                // Beispielhafter Code für PDF-Generierung mit jsPDF:
                /*
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                doc.setFontSize(22);
                doc.text('ZagMobi Ticket', 105, 20, { align: 'center' });

                doc.setFontSize(16);
                doc.text(document.getElementById('selectedTicketName').textContent, 105, 30, { align: 'center' });

                doc.setFontSize(12);
                doc.text(`Fahrgast: ${passengerName}`, 20, 50);
                doc.text(`Strecke: ${startStop} → ${endStop}`, 20, 60);
                doc.text(`Datum: ${formattedDate}`, 20, 70);
                doc.text(`Preis: ${document.getElementById('totalPriceDisplay').textContent}`, 20, 80);
                doc.text(`Ticket-Nr: ${ticketNumber}`, 20, 90);

                doc.save('ZagMobi-Ticket.pdf');
                */
            });
        }
    }
}

/**
 * Ticket-Erfolgs-Modal einrichten
 */
function setupTicketSuccessModal() {
    const ticketSuccessModal = document.getElementById('ticketSuccessModal');
    const closeTicketSuccessModal = document.getElementById('closeTicketSuccessModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const downloadAgainBtn = document.getElementById('downloadAgainBtn');

    if (ticketSuccessModal && closeTicketSuccessModal && closeSuccessBtn) {
        // Schließen-Button
        closeTicketSuccessModal.addEventListener('click', function() {
            ticketSuccessModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Schließen-Button unten
        closeSuccessBtn.addEventListener('click', function() {
            ticketSuccessModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Klick außerhalb des Modals
        ticketSuccessModal.addEventListener('click', function(e) {
            if (e.target === ticketSuccessModal) {
                ticketSuccessModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Erneut herunterladen Button
        if (downloadAgainBtn) {
            downloadAgainBtn.addEventListener('click', function() {
                // In einer realen Anwendung würde hier das Ticket erneut heruntergeladen werden
                alert('Ticket wurde erneut heruntergeladen.');
            });
        }
    }
}