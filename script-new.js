// Einfache, funktionierende Version ohne komplexe Klassen

let currentName = '';
let selectedStyle = '';
let selectedPreview = null;

const signatureStyles = [
    { name: 'Elegant', class: 'style-elegant', description: 'Klassisch und elegant' },
    { name: 'Casual', class: 'style-casual', description: 'Locker und modern' },
    { name: 'Handwritten', class: 'style-handwritten', description: 'Handgeschrieben-Look' },
    { name: 'Script Bold', class: 'style-script-bold', description: 'Kräftig und schwungvoll' },
    { name: 'Minimalist', class: 'style-minimalist', description: 'Clean und modern' },
    { name: 'Classic', class: 'style-classic', description: 'Traditionell elegant' },
    { name: 'Business', class: 'style-business', description: 'Professionell' },
    { name: 'Royal Script', class: 'style-royal', description: 'Königlich mit Schnörkeln' },
    { name: 'Flourish', class: 'style-flourish', description: 'Mit eleganten Kringeln' },
    { name: 'Underlined', class: 'style-underlined', description: 'Mit dekorativem Unterstrich' },
    { name: 'Swash', class: 'style-swash', description: 'Mit schwungvollen Bögen' },
    { name: 'Vintage', class: 'style-vintage', description: 'Vintage-Stil mit Verzierungen' },
    { name: 'Calligraphy', class: 'style-calligraphy', description: 'Kalligrafisch mit Loops' }
];

// Warten bis die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, setting up events');
    
    // Event Listeners
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    
    if (nameInput && generateBtn) {
        nameInput.addEventListener('input', function(e) {
            generateBtn.disabled = e.target.value.trim().length === 0;
        });
        
        generateBtn.addEventListener('click', generateSignatures);
    }
    
    const selectStyleBtn = document.getElementById('selectStyleBtn');
    if (selectStyleBtn) {
        selectStyleBtn.addEventListener('click', selectSignatureStyle);
    }
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPracticeSheet);
    }
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    
    const showGuides = document.getElementById('showGuides');
    const lineCount = document.getElementById('lineCount');
    const pageFormat = document.getElementById('pageFormat');
    const fontOpacity = document.getElementById('fontOpacity');
    const fontColor = document.getElementById('fontColor');
    
    if (showGuides) {
        showGuides.addEventListener('change', updatePracticeCanvas);
    }
    if (lineCount) {
        lineCount.addEventListener('change', updatePracticeCanvas);
    }
    if (pageFormat) {
        pageFormat.addEventListener('change', updatePracticeCanvas);
    }
    if (fontOpacity) {
        fontOpacity.addEventListener('change', updatePracticeCanvas);
    }
    if (fontColor) {
        fontColor.addEventListener('change', updatePracticeCanvas);
    }
    
    // Zoom functionality
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.addEventListener('input', updateZoom);
    }
    
    console.log('All event listeners set up');
});

function generateSignatures() {
    console.log('generateSignatures called');
    
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const previewSection = document.getElementById('previewSection');
    const fontContainer = document.getElementById('fontSignatures');
    
    if (!nameInput || !generateBtn || !previewSection || !fontContainer) {
        console.error('Required elements not found');
        alert('Fehler: Seiten-Elemente nicht gefunden. Bitte Seite neu laden.');
        return;
    }
    
    const name = nameInput.value.trim();
    if (!name) {
        alert('Bitte geben Sie einen Namen ein!');
        return;
    }

    console.log('Creating signatures for:', name);
    currentName = name;

    // Loading anzeigen
    generateBtn.textContent = 'Erstelle...';
    generateBtn.disabled = true;

    // Container leeren
    fontContainer.innerHTML = '';

    try {
        // Signature Previews erstellen
        signatureStyles.forEach(function(style, index) {
            const preview = document.createElement('div');
            preview.className = 'signature-preview';
            preview.dataset.style = style.name;
            preview.dataset.index = index;

            preview.innerHTML = `
                <div class="signature-text ${style.class}">${name}</div>
                <div class="signature-style">${style.name} - ${style.description}</div>
            `;

            preview.addEventListener('click', function() {
                selectPreview(preview, style);
            });

            fontContainer.appendChild(preview);
        });

        // Preview section anzeigen
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });

        console.log('Signatures created successfully');

    } catch (error) {
        console.error('Error creating signatures:', error);
        alert('Fehler beim Erstellen der Unterschriften: ' + error.message);
    }

    // Button zurücksetzen
    generateBtn.textContent = 'Vorlagen Erstellen';
    generateBtn.disabled = false;
}

function selectPreview(preview, style) {
    // Alle anderen deselektieren
    document.querySelectorAll('.signature-preview').forEach(function(p) {
        p.classList.remove('selected');
    });

    // Diesen Preview selektieren
    preview.classList.add('selected');
    selectedPreview = preview;
    selectedStyle = style.name;

    // Select Button aktivieren
    const selectStyleBtn = document.getElementById('selectStyleBtn');
    if (selectStyleBtn) {
        selectStyleBtn.disabled = false;
        selectStyleBtn.textContent = `"${style.name}" Stil auswählen`;
    }
}

function selectSignatureStyle() {
    if (!selectedPreview) return;

    const practiceSection = document.getElementById('practiceSection');
    const previewSection = document.getElementById('previewSection');
    const selectedName = document.getElementById('selectedName');
    const selectedStyleSpan = document.getElementById('selectedStyle');

    if (selectedName) selectedName.textContent = currentName;
    if (selectedStyleSpan) selectedStyleSpan.textContent = selectedStyle;

    // Preview verstecken, Practice anzeigen
    if (previewSection) previewSection.style.display = 'none';
    if (practiceSection) {
        practiceSection.style.display = 'block';
        updatePracticeCanvas();
        practiceSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function updatePracticeCanvas() {
    const canvas = document.getElementById('practiceCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const showGuides = document.getElementById('showGuides');
    const lineCount = document.getElementById('lineCount');
    const pageFormat = document.getElementById('pageFormat');
    const fontOpacity = document.getElementById('fontOpacity');
    const fontColor = document.getElementById('fontColor');
    
    const showGuidesChecked = showGuides ? showGuides.checked : true;
    const lineCountValue = lineCount ? parseInt(lineCount.value) : 12;
    const formatValue = pageFormat ? pageFormat.value : 'A3-landscape';
    const opacityValue = fontOpacity ? parseFloat(fontOpacity.value) : 0.15;
    const colorValue = fontColor ? fontColor.value : '0,0,0';
    
    // Format-spezifische Einstellungen
    let printWidth, printHeight;
    
    switch(formatValue) {
        case 'A4-portrait':
            printWidth = 2480;  // 210mm bei 300 DPI
            printHeight = 3508; // 297mm bei 300 DPI
            break;
        case 'A4-landscape':
            printWidth = 3508;  // 297mm bei 300 DPI
            printHeight = 2480; // 210mm bei 300 DPI
            break;
        case 'A3-portrait':
            printWidth = 3508;  // 297mm bei 300 DPI
            printHeight = 4961; // 420mm bei 300 DPI
            break;
        case 'A3-landscape':
        default:
            printWidth = 4961;  // 420mm bei 300 DPI
            printHeight = 3508; // 297mm bei 300 DPI
            break;
    }
    
    // Canvas für gewähltes Format einstellen
    canvas.width = printWidth;
    canvas.height = printHeight;
    
    // Display-Größe responsive halten
    const aspectRatio = printWidth / printHeight;
    if (aspectRatio > 1) {
        canvas.style.width = '800px';
        canvas.style.height = (800 / aspectRatio) + 'px';
    } else {
        canvas.style.height = '600px';
        canvas.style.width = (600 * aspectRatio) + 'px';
    }
    
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const margin = 200; // Größerer Rand für alle Formate
    const usableHeight = printHeight - 2 * margin;
    const lineSpacing = usableHeight / (lineCountValue + 1);
    
    // Hintergrund weiß
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, printWidth, printHeight);

    // Zeilen zeichnen - mehr Platz ausnutzen
    for (let i = 1; i <= lineCountValue; i++) {
        const y = margin + i * lineSpacing;
        
        // Hilfslinien zeichnen
        if (showGuidesChecked) {
            drawGuideLine(ctx, y - 40, '#e0e0e0', 2, printWidth);
            drawGuideLine(ctx, y, '#cccccc', 3, printWidth);
            drawGuideLine(ctx, y + 40, '#e0e0e0', 2, printWidth);
        }
        
        // Unterschrift Vorlage zeichnen
        drawSignatureTemplate(ctx, y, printWidth, opacityValue, colorValue);
    }
}

function drawGuideLine(ctx, y, color, width, canvasWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(150, y);
    ctx.lineTo(canvasWidth - 150, y); // Angepasst für gewählte Breite
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawSignatureTemplate(ctx, y, canvasWidth, opacity, colorRGB) {
    ctx.save();
    ctx.strokeStyle = `rgba(${colorRGB}, ${opacity})`;
    ctx.lineWidth = 4;
    
    const fontFamily = getFontFamily();
    ctx.font = `80px ${fontFamily}`;
    ctx.textAlign = 'left';
    
    // Namen mehrmals pro Zeile zeichnen - angepasst für gewähltes Format
    const nameWidth = ctx.measureText(currentName).width;
    const spacing = 60;
    const totalWidth = nameWidth + spacing;
    const startX = 200;
    const maxX = canvasWidth - 200; // Angepasst für gewählte Breite
    
    let currentX = startX;
    while (currentX + nameWidth < maxX) {
        ctx.strokeText(currentName, currentX, y);
        currentX += totalWidth;
    }
    
    ctx.restore();
}

function getFontFamily() {
    const fontMap = {
        'Elegant': 'Allura, cursive',
        'Casual': 'Dancing Script, cursive',
        'Handwritten': 'Caveat, cursive',
        'Script Bold': 'Great Vibes, cursive',
        'Minimalist': 'Kalam, cursive',
        'Classic': 'Satisfy, cursive',
        'Business': 'Pacifico, cursive',
        'Royal Script': 'Allura, cursive',
        'Flourish': 'Great Vibes, cursive',
        'Underlined': 'Dancing Script, cursive',
        'Swash': 'Satisfy, cursive',
        'Vintage': 'Great Vibes, cursive',
        'Calligraphy': 'Allura, cursive'
    };
    return fontMap[selectedStyle] || 'Arial, sans-serif';
}

function downloadPracticeSheet() {
    const canvas = document.getElementById('practiceCanvas');
    if (!canvas) return;
    
    // Erstelle einen temporären Link
    const link = document.createElement('a');
    
    // Dateiname mit Datum für bessere Organisation
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD Format
    
    link.download = `Unterschrift-Uebungsblatt_${currentName}_${selectedStyle}_${dateString}.png`;
    
    // Canvas als hochqualitatives PNG exportieren
    link.href = canvas.toDataURL('image/png', 1.0); // Maximale Qualität
    
    // Info für den Benutzer
    console.log('Download gestartet:', link.download);
    console.log('Bildgröße:', canvas.width, 'x', canvas.height, 'Pixel');
    console.log('Empfohlene Druckgröße: A4 (297mm x 210mm) bei 300 DPI');
    
    // Download starten
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Kurze Bestätigung anzeigen
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = '✅ Heruntergeladen!';
    downloadBtn.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        downloadBtn.textContent = originalText;
        downloadBtn.style.backgroundColor = '';
    }, 2000);
}

function goBack() {
    const practiceSection = document.getElementById('practiceSection');
    const previewSection = document.getElementById('previewSection');
    const selectStyleBtn = document.getElementById('selectStyleBtn');

    if (practiceSection) practiceSection.style.display = 'none';
    if (previewSection) previewSection.style.display = 'block';
    
    // Selection zurücksetzen
    if (selectStyleBtn) {
        selectStyleBtn.disabled = true;
        selectStyleBtn.textContent = 'Stil auswählen';
    }
    
    if (selectedPreview) {
        selectedPreview.classList.remove('selected');
        selectedPreview = null;
    }
}

// Zoom functionality
function updateZoom() {
    const zoomLevel = document.getElementById('zoomLevel');
    const zoomValue = document.querySelector('.zoom-value');
    const canvasContainer = document.getElementById('canvasContainer');
    
    if (!zoomLevel || !canvasContainer) return;
    
    const zoom = parseInt(zoomLevel.value);
    const scale = zoom / 100;
    
    // Update zoom display
    if (zoomValue) {
        zoomValue.textContent = zoom + '%';
    }
    
    // Apply zoom to canvas container
    canvasContainer.style.transform = `scale(${scale})`;
    canvasContainer.style.transformOrigin = 'center center';
    
    // Adjust container padding based on zoom to prevent clipping
    const practiceCanvas = document.querySelector('.practice-canvas');
    if (practiceCanvas) {
        const extraPadding = Math.max(0, (scale - 1) * 200);
        practiceCanvas.style.padding = `${20 + extraPadding}px`;
    }
}

// Initialize zoom on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial zoom
    const zoomLevel = document.getElementById('zoomLevel');
    const zoomValue = document.querySelector('.zoom-value');
    
    if (zoomLevel && zoomValue) {
        zoomValue.textContent = zoomLevel.value + '%';
    }
});
