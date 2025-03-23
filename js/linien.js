/**
 * ZagMobi Linien & Fahrpläne JavaScript
 * Funktionen für die Anzeige und Interaktion mit den Linien und Fahrplänen
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ripple-Effekt für Buttons initialisieren
    const rippleElements = document.querySelectorAll('.mdc-button');
    rippleElements.forEach(element => {
        mdc.ripple.MDCRipple.attachTo(element);
    });

    // Tabs für Linientypen
    setupLinienTabs();

    // Fahrplan-Modal
    setupScheduleModal();

    // Streckenverlauf-Modal
    setupMapModal();

    // Netzplan Zoom-Steuerung
    setupNetworkMapZoom();
});

/**
 * Tabs für die verschiedenen Linientypen einrichten
 */
function setupLinienTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const linienSections = document.querySelectorAll('.linien-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Aktiven Tab markieren
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Entsprechende Sektion anzeigen
            const targetId = this.getAttribute('data-target');
            linienSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/**
 * Fahrplan-Modal einrichten
 */
function setupScheduleModal() {
    const scheduleButtons = document.querySelectorAll('.show-schedule-btn');
    const scheduleModal = document.getElementById('scheduleModal');
    const closeScheduleModal = document.getElementById('closeScheduleModal');

    if (scheduleButtons.length && scheduleModal && closeScheduleModal) {
        // Buttons für Fahrpläne
        scheduleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lineId = this.getAttribute('data-line');
                const lineName = this.closest('.linie-card').querySelector('.linie-name').textContent;

                // Modal mit Daten füllen
                document.getElementById('scheduleLineId').textContent = lineId;
                document.getElementById('scheduleLineName').textContent = lineName;

                // Demo-Daten für den Fahrplan laden
                loadScheduleData(lineId);

                // Modal anzeigen
                scheduleModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // Schließen-Button
        closeScheduleModal.addEventListener('click', function() {
            scheduleModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Klick außerhalb des Modals
        scheduleModal.addEventListener('click', function(e) {
            if (e.target === scheduleModal) {
                scheduleModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Tabs für Hin- und Rückfahrt
        const scheduleTabs = document.querySelectorAll('.schedule-tab');
        scheduleTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                scheduleTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const direction = this.getAttribute('data-direction');
                const lineId = document.getElementById('scheduleLineId').textContent;
                loadScheduleData(lineId, direction);
            });
        });
    }
}

/**
 * Streckenverlauf-Modal einrichten
 */
function setupMapModal() {
    const mapButtons = document.querySelectorAll('.show-map-btn');
    const mapModal = document.getElementById('mapModal');
    const closeMapModal = document.getElementById('closeMapModal');

    if (mapButtons.length && mapModal && closeMapModal) {
        // Buttons für Streckenverlauf
        mapButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lineId = this.getAttribute('data-line');
                const lineName = this.closest('.linie-card').querySelector('.linie-name').textContent;

                // Modal mit Daten füllen
                document.getElementById('mapLineId').textContent = lineId;

                // Modal-Header je nach Linientyp einfärben
                const mapModalHeader = document.getElementById('mapModalHeader');
                mapModalHeader.className = 'modal-header';

                if (lineId.startsWith('B')) {
                    mapModalHeader.classList.add('bus-header');
                } else if (lineId.startsWith('T')) {
                    mapModalHeader.classList.add('tram-header');
                } else if (lineId.startsWith('S')) {
                    mapModalHeader.classList.add('sbahn-header');
                } else if (lineId.startsWith('RB') || lineId.startsWith('RE')) {
                    mapModalHeader.classList.add('regional-header');
                } else if (lineId.startsWith('IC')) {
                    mapModalHeader.classList.add('ice-header');
                }

                // Demo-Daten für den Streckenverlauf laden
                loadRouteMapData(lineId);

                // Modal anzeigen
                mapModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // Schließen-Button
        closeMapModal.addEventListener('click', function() {
            mapModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        // Klick außerhalb des Modals
        mapModal.addEventListener('click', function(e) {
            if (e.target === mapModal) {
                mapModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

/**
 * Demo-Daten für den Fahrplan laden
 * In einer realen Anwendung würden diese Daten von einer API kommen
 * @param {string} lineId - Die ID der Linie (z.B. "B1")
 * @param {string} direction - Die Richtung ("outbound" oder "inbound")
 */
function loadScheduleData(lineId, direction = 'outbound') {
    const tableBody = document.getElementById('scheduleTableBody');
    tableBody.innerHTML = '';

    // Demo-Fahrplandaten
    let stops = [];

    if (lineId === 'B1') {
        if (direction === 'outbound') {
            stops = [
                { name: 'Hauptbahnhof', arrival: '-', departure: '06:00', notes: 'Startpunkt' },
                { name: 'Rathaus', arrival: '06:05', departure: '06:06', notes: '' },
                { name: 'Marktplatz', arrival: '06:10', departure: '06:12', notes: '' },
                { name: 'Stadthalle', arrival: '06:18', departure: '06:19', notes: '' },
                { name: 'Universität', arrival: '06:25', departure: '-', notes: 'Endstation' }
            ];
        } else {
            stops = [
                { name: 'Universität', arrival: '-', departure: '06:30', notes: 'Startpunkt' },
                { name: 'Stadthalle', arrival: '06:36', departure: '06:37', notes: '' },
                { name: 'Marktplatz', arrival: '06:43', departure: '06:45', notes: '' },
                { name: 'Rathaus', arrival: '06:49', departure: '06:50', notes: '' },
                { name: 'Hauptbahnhof', arrival: '06:55', departure: '-', notes: 'Endstation' }
            ];
        }
    } else if (lineId === 'T2') {
        if (direction === 'outbound') {
            stops = [
                { name: 'Zagen Hbf', arrival: '-', departure: '05:30', notes: 'Startpunkt' },
                { name: 'Stadtpark', arrival: '05:35', departure: '05:36', notes: '' },
                { name: 'Innenstadt', arrival: '05:42', departure: '05:44', notes: '' },
                { name: 'Museumsviertel', arrival: '05:50', departure: '05:51', notes: 'Barrierefreier Ausbau' },
                { name: 'Industriepark', arrival: '05:58', departure: '05:59', notes: '' },
                { name: 'Werksgelände', arrival: '06:05', departure: '-', notes: 'Endstation' }
            ];
        } else {
            stops = [
                { name: 'Werksgelände', arrival: '-', departure: '06:10', notes: 'Startpunkt' },
                { name: 'Industriepark', arrival: '06:16', departure: '06:17', notes: '' },
                { name: 'Museumsviertel', arrival: '06:24', departure: '06:25', notes: 'Barrierefreier Ausbau' },
                { name: 'Innenstadt', arrival: '06:31', departure: '06:33', notes: '' },
                { name: 'Stadtpark', arrival: '06:39', departure: '06:40', notes: '' },
                { name: 'Zagen Hbf', arrival: '06:45', departure: '-', notes: 'Endstation' }
            ];
        }
    } else {
        // Generische Daten für andere Linien
        if (direction === 'outbound') {
            stops = [
                { name: 'Startstation', arrival: '-', departure: '06:00', notes: 'Startpunkt' },
                { name: 'Station 2', arrival: '06:10', departure: '06:11', notes: '' },
                { name: 'Station 3', arrival: '06:20', departure: '06:21', notes: '' },
                { name: 'Station 4', arrival: '06:30', departure: '06:31', notes: '' },
                { name: 'Endstation', arrival: '06:40', departure: '-', notes: 'Endstation' }
            ];
        } else {
            stops = [
                { name: 'Endstation', arrival: '-', departure: '07:00', notes: 'Startpunkt' },
                { name: 'Station 4', arrival: '07:10', departure: '07:11', notes: '' },
                { name: 'Station 3', arrival: '07:20', departure: '07:21', notes: '' },
                { name: 'Station 2', arrival: '07:30', departure: '07:31', notes: '' },
                { name: 'Startstation', arrival: '07:40', departure: '-', notes: 'Endstation' }
            ];
        }
    }

    // Fahrplan in Tabelle einfügen
    stops.forEach(stop => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = stop.name;
        row.appendChild(nameCell);

        const arrivalCell = document.createElement('td');
        arrivalCell.textContent = stop.arrival;
        row.appendChild(arrivalCell);

        const departureCell = document.createElement('td');
        departureCell.textContent = stop.departure;
        row.appendChild(departureCell);

        const notesCell = document.createElement('td');
        notesCell.textContent = stop.notes;
        row.appendChild(notesCell);

        tableBody.appendChild(row);
    });
}

/**
 * Demo-Daten für den Streckenverlauf laden
 * In einer realen Anwendung würden diese Daten von einer API kommen
 * @param {string} lineId - Die ID der Linie (z.B. "B1")
 */
function loadRouteMapData(lineId) {
    const routeMapContainer = document.getElementById('routeMapContainer');
    const routeStopsList = document.getElementById('routeStopsList');

    // Demo-Karte (in einer realen Anwendung würde hier eine echte Karte angezeigt werden)
    routeMapContainer.innerHTML = `
        <div style="background-color: #f5f5f5; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem;">
            <span class="material-icons" style="font-size: 3rem; color: var(--primary-dark);">map</span>
            <div>Streckenverlauf ${lineId}</div>
            <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6);">(In einer realen Anwendung würde hier eine Karte angezeigt werden)</div>
        </div>
    `;

    // Leere Liste
    routeStopsList.innerHTML = '';

    // Demo-Haltestellen je nach Linie
    let stops = [];

    if (lineId === 'B1') {
        stops = ['Hauptbahnhof', 'Rathaus', 'Marktplatz', 'Stadthalle', 'Universität'];
    } else if (lineId === 'T2') {
        stops = ['Zagen Hbf', 'Stadtpark', 'Innenstadt', 'Museumsviertel', 'Industriepark', 'Werksgelände'];
    } else if (lineId === 'S1') {
        stops = ['Zagen Hbf', 'Messe', 'Technologiepark', 'Vorstadt Nord', 'Waldrand', 'Umlandkreis'];
    } else if (lineId.startsWith('RB') || lineId.startsWith('RE')) {
        stops = ['Zagen Hbf', 'Vorort Ost', 'Neustadt', 'Waldheim', 'Bergdorf'];
    } else if (lineId === 'IC' || lineId === 'ICE') {
        stops = ['Zagen Hbf', 'Großstadt', 'Regionalzentrum', 'Hauptstadt'];
    } else {
        stops = ['Startstation', 'Station 2', 'Station 3', 'Station 4', 'Endstation'];
    }

    // Haltestellen in Liste einfügen
    stops.forEach(stop => {
        const listItem = document.createElement('li');
        listItem.textContent = stop;
        routeStopsList.appendChild(listItem);
    });
}

/**
 * Zoom-Steuerung für die Netzplan-Karte einrichten
 */
function setupNetworkMapZoom() {
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const networkMap = document.querySelector('.network-map-img');

    if (zoomInBtn && zoomOutBtn && networkMap) {
        let scale = 1;

        zoomInBtn.addEventListener('click', function() {
            if (scale < 2) {
                scale += 0.1;
                networkMap.style.transform = `scale(${scale})`;
            }
        });

        zoomOutBtn.addEventListener('click', function() {
            if (scale > 0.5) {
                scale -= 0.1;
                networkMap.style.transform = `scale(${scale})`;
            }
        });