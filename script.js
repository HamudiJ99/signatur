class SignaturePracticeApp {
    constructor() {
        this.currentName = '';
        this.selectedStyle = '';
        this.selectedSignature = null;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        
        this.signatureStyles = [
            { name: 'Elegant', class: 'style-elegant', description: 'Klassisch und elegant', type: 'font' },
            { name: 'Casual', class: 'style-casual', description: 'Locker und modern', type: 'font' },
            { name: 'Handwritten', class: 'style-handwritten', description: 'Handgeschrieben-Look', type: 'font' },
            { name: 'Script Bold', class: 'style-script-bold', description: 'Kräftig und schwungvoll', type: 'font' },
            { name: 'Minimalist', class: 'style-minimalist', description: 'Clean und modern', type: 'font' },
            { name: 'Classic Cursive', class: 'style-classic', description: 'Traditionell elegant', type: 'font' },
            { name: 'Business', class: 'style-business', description: 'Professionell', type: 'font' }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCanvas();
    }

    setupEventListeners() {
        const nameInput = document.getElementById('nameInput');
        const generateBtn = document.getElementById('generateBtn');
        const selectStyleBtn = document.getElementById('selectStyleBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const backBtn = document.getElementById('backBtn');
        const showGuides = document.getElementById('showGuides');
        const lineCount = document.getElementById('lineCount');

        nameInput.addEventListener('input', (e) => {
            generateBtn.disabled = e.target.value.trim().length === 0;
        });

        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !generateBtn.disabled) {
                this.generateSignatures();
            }
        });

        generateBtn.addEventListener('click', () => this.generateSignatures());
        selectStyleBtn.addEventListener('click', () => this.selectSignatureStyle());
        downloadBtn.addEventListener('click', () => this.downloadPracticeSheet());
        backBtn.addEventListener('click', () => this.goBack());
        showGuides.addEventListener('change', () => this.updatePracticeCanvas());
        lineCount.addEventListener('change', () => this.updatePracticeCanvas());
    }

    setupCanvas() {
        this.canvas = document.getElementById('practiceCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set up high-DPI canvas
        const rect = this.canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * ratio;
        this.canvas.height = rect.height * ratio;
        this.ctx.scale(ratio, ratio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    generateSignatures() {
        const nameInput = document.getElementById('nameInput');
        const name = nameInput.value.trim();
        
        if (!name) return;

        this.currentName = name;
        const previewSection = document.getElementById('previewSection');

        // Show loading state
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.innerHTML = 'Erstelle Vorlagen...<span class="loading"></span>';
        generateBtn.disabled = true;

        // Vereinfachte Logik - alle in einem Container
        const fontContainer = document.getElementById('fontSignatures');
        
        // Clear container
        fontContainer.innerHTML = '';
        
        this.signatureStyles.forEach((style, index) => {
            const preview = this.createSignaturePreview(name, style, index);
            fontContainer.appendChild(preview);
        });

        // Hide other containers since we're not using them
        document.getElementById('realisticSignatures').innerHTML = '';
        document.getElementById('famousSignatures').innerHTML = '';

        previewSection.style.display = 'block';
        previewSection.classList.add('fade-in');
        
        // Reset button
        generateBtn.innerHTML = 'Vorlagen Erstellen';
        generateBtn.disabled = false;

        // Scroll to preview
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }

    createSignaturePreview(name, style, index) {
        const preview = document.createElement('div');
        preview.className = 'signature-preview';
        preview.dataset.style = style.name;
        preview.dataset.index = index;

        // Alle Stile verwenden jetzt normale Schriftarten - einfach und effektiv
        preview.innerHTML = `
            <div class="signature-text ${style.class}">${name}</div>
            <div class="signature-style">${style.name} - ${style.description}</div>
        `;

        preview.addEventListener('click', () => {
            this.selectPreview(preview);
        });

        return preview;
    }

    createRealisticSignature(name, style) {
        const width = 280;
        const height = 80;
        
        // Use completely different signature patterns based on famous people's actual styles
        if (style.type === 'famous') {
            return this.createFamousSignature(name, style, width, height);
        } else {
            return this.createHandwrittenSignature(name, style, width, height);
        }
    }

    createFamousSignature(name, style, width, height) {
        let path = '';
        
        switch(style.class) {
            case 'style-einstein':
                // Einstein had very distinctive, flowing cursive with large loops
                path = this.createEinsteinStyle(name, width, height);
                break;
            case 'style-jobs':
                // Jobs had a very clean, minimalist signature with strong vertical strokes
                path = this.createJobsStyle(name, width, height);
                break;
            case 'style-gates':
                // Gates has a technical, somewhat angular style
                path = this.createGatesStyle(name, width, height);
                break;
            case 'style-armstrong':
                // Armstrong had bold, confident strokes with distinctive flourishes
                path = this.createArmstrongStyle(name, width, height);
                break;
            default:
                path = this.createGenericRealisticStyle(name, width, height);
        }
        
        return `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <path d="${path}" 
                      fill="none" 
                      stroke="#333" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                      class="signature-path ${style.class}"/>
            </svg>
        `;
    }

    createEinsteinStyle(name, width, height) {
        // Einstein's signature: flowing, scientific, with distinctive E and loops
        const centerY = height / 2;
        let path = `M15,${centerY-5}`;
        
        // Characteristic Einstein "A" or first letter with scientific flair
        if (name[0].toLowerCase() === 'a' || name[0].toLowerCase() === 'e') {
            path += ` C20,${centerY-20} 35,${centerY-15} 45,${centerY}`;
            path += ` C50,${centerY+10} 45,${centerY+15} 35,${centerY+8}`;
            path += ` M45,${centerY-5} C55,${centerY-18} 75,${centerY-10} 85,${centerY+5}`;
        } else {
            path += ` C25,${centerY-15} 40,${centerY-20} 55,${centerY-5}`;
        }
        
        // Add the characteristic Einstein flowing middle section
        path += ` C70,${centerY-25} 95,${centerY+20} 120,${centerY-10}`;
        path += ` C140,${centerY-30} 165,${centerY+15} 185,${centerY}`;
        
        // Einstein's distinctive ending flourish
        path += ` C200,${centerY-15} 220,${centerY+20} 240,${centerY-5}`;
        path += ` C250,${centerY-20} 260,${centerY+10} 270,${centerY}`;
        
        return path;
    }

    createJobsStyle(name, width, height) {
        // Jobs: Clean, minimal, strong vertical elements, very controlled
        const centerY = height / 2;
        let path = `M20,${centerY+10}`;
        
        // Clean, minimal first letter
        path += ` L20,${centerY-15} M20,${centerY-5} C35,${centerY-20} 50,${centerY-15} 65,${centerY}`;
        
        // Jobs' characteristic clean, horizontal flow
        path += ` L85,${centerY} C95,${centerY-8} 105,${centerY-5} 115,${centerY+3}`;
        path += ` L135,${centerY+3} C145,${centerY-5} 155,${centerY-8} 165,${centerY}`;
        
        // Minimal ending - Jobs avoided flourishes
        path += ` L185,${centerY} C195,${centerY-3} 205,${centerY-3} 215,${centerY}`;
        
        return path;
    }

    createGatesStyle(name, width, height) {
        // Gates: Technical, somewhat angular, consistent spacing
        const centerY = height / 2;
        let path = `M15,${centerY}`;
        
        // Angular, technical style
        path += ` C25,${centerY-12} 35,${centerY-15} 45,${centerY-8}`;
        path += ` L55,${centerY-8} C65,${centerY-15} 75,${centerY-12} 85,${centerY}`;
        
        // Gates' consistent, methodical strokes
        path += ` L95,${centerY} C105,${centerY-10} 115,${centerY-8} 125,${centerY+2}`;
        path += ` L140,${centerY+2} C150,${centerY-6} 160,${centerY-8} 170,${centerY}`;
        
        // Technical ending with slight upturn
        path += ` C180,${centerY-5} 190,${centerY-3} 200,${centerY+2}`;
        
        return path;
    }

    createArmstrongStyle(name, width, height) {
        // Armstrong: Bold, confident, astronaut-like precision with flourishes
        const centerY = height / 2;
        let path = `M12,${centerY+5}`;
        
        // Bold, confident start
        path += ` C18,${centerY-20} 35,${centerY-25} 50,${centerY-10}`;
        path += ` C65,${centerY-30} 80,${centerY+15} 95,${centerY-5}`;
        
        // Armstrong's characteristic bold middle section
        path += ` C110,${centerY-25} 125,${centerY+20} 140,${centerY-10}`;
        path += ` C155,${centerY-20} 170,${centerY+10} 185,${centerY}`;
        
        // Strong, confident ending flourish
        path += ` C200,${centerY-15} 215,${centerY+25} 235,${centerY-5}`;
        path += ` C245,${centerY-20} 255,${centerY+15} 265,${centerY+5}`;
        
        return path;
    }

    createHandwrittenSignature(name, style, width, height) {
        const centerY = height / 2;
        let path = `M20,${centerY}`;
        
        if (style.class === 'style-realistic') {
            // More natural, flowing handwriting
            path += ` C35,${centerY-15} 55,${centerY-20} 75,${centerY-5}`;
            path += ` C95,${centerY-25} 115,${centerY+20} 135,${centerY-10}`;
            path += ` C155,${centerY-15} 175,${centerY+15} 195,${centerY}`;
            path += ` C210,${centerY-10} 225,${centerY+10} 240,${centerY-5}`;
            
            // Add a realistic loop
            path += ` M180,${centerY-5} A8,8 0 1,1 195,${centerY-5}`;
            
        } else if (style.class === 'style-business') {
            // Business style with characteristic loops and circles
            path += ` C40,${centerY-18} 65,${centerY-22} 90,${centerY-8}`;
            path += ` C115,${centerY-28} 140,${centerY+18} 165,${centerY-12}`;
            
            // Add business-style loops
            path += ` M120,${centerY-10} A12,12 0 1,1 145,${centerY-10}`;
            path += ` M190,${centerY} C205,${centerY-15} 220,${centerY+15} 235,${centerY}`;
            
        } else if (style.class === 'style-doctor') {
            // Doctor style - more erratic, quick strokes
            path += ` C30,${centerY-10} 45,${centerY+8} 60,${centerY-12}`;
            path += ` C75,${centerY+15} 90,${centerY-8} 105,${centerY+5}`;
            path += ` C120,${centerY-15} 135,${centerY+12} 150,${centerY-3}`;
            path += ` C165,${centerY+8} 180,${centerY-12} 195,${centerY+6}`;
            
            // Add doctor-style squiggles
            for (let i = 0; i < 3; i++) {
                const x = 200 + i * 15;
                path += ` M${x},${centerY-5} Q${x+5},${centerY-15} ${x+10},${centerY+5} Q${x+15},${centerY+15} ${x+20},${centerY-5}`;
            }
        }
        
        return path;
    }

    selectPreview(preview) {
        // Remove selection from all previews
        document.querySelectorAll('.signature-preview').forEach(p => {
            p.classList.remove('selected');
        });

        // Select clicked preview
        preview.classList.add('selected');
        this.selectedSignature = preview;
        this.selectedStyle = preview.dataset.style;

        // Enable select button
        const selectStyleBtn = document.getElementById('selectStyleBtn');
        selectStyleBtn.disabled = false;
        selectStyleBtn.textContent = `"${this.selectedStyle}" Stil auswählen`;
    }

    selectSignatureStyle() {
        if (!this.selectedSignature) return;

        const practiceSection = document.getElementById('practiceSection');
        const selectedName = document.getElementById('selectedName');
        const selectedStyleSpan = document.getElementById('selectedStyle');

        selectedName.textContent = this.currentName;
        selectedStyleSpan.textContent = this.selectedStyle;

        // Hide preview section
        document.getElementById('previewSection').style.display = 'none';

        // Show practice section
        practiceSection.style.display = 'block';
        practiceSection.classList.add('fade-in');

        // Update canvas
        this.updatePracticeCanvas();

        // Scroll to practice section
        practiceSection.scrollIntoView({ behavior: 'smooth' });
    }

    updatePracticeCanvas() {
        if (!this.canvas || !this.ctx) return;

        const showGuides = document.getElementById('showGuides').checked;
        const lineCount = parseInt(document.getElementById('lineCount').value);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const canvasWidth = 800;
        const canvasHeight = 600;
        const margin = 50;
        const lineSpacing = (canvasHeight - 2 * margin) / (lineCount + 1);
        
        // Set canvas style
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Get the selected style
        const styleClass = this.signatureStyles.find(s => s.name === this.selectedStyle)?.class || 'style-elegant';
        
        for (let i = 1; i <= lineCount; i++) {
            const y = margin + i * lineSpacing;
            
            // Draw guide lines if enabled
            if (showGuides) {
                this.drawGuideLine(y - 20, '#e0e0e0', 1);
                this.drawGuideLine(y, '#cccccc', 2);
                this.drawGuideLine(y + 20, '#e0e0e0', 1);
            }
            
            // Draw signature template (very light)
            this.drawSignatureTemplate(y - 10, styleClass);
        }
    }

    drawGuideLine(y, color, width) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(50, y);
        this.ctx.lineTo(750, y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawSignatureTemplate(y, styleClass) {
        this.ctx.save();
        
        // Draw font-based signature template (alle Stile verwenden jetzt Fonts)
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 2;
        
        const fontFamily = this.getFontFamily(styleClass);
        this.ctx.font = `40px ${fontFamily}`;
        this.ctx.textAlign = 'left';
        
        this.ctx.strokeText(this.currentName, 60, y);
        
        this.ctx.restore();
    }

    drawSVGSignatureTemplate(y, style) {
        // Create a very light version of the realistic signature
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([]);
        
        // Draw the signature based on the selected famous person or realistic style
        if (style.type === 'famous') {
            this.drawFamousSignatureTemplate(y, style);
        } else {
            this.drawRealisticSignatureTemplate(y, style);
        }
    }

    drawFamousSignatureTemplate(y, style) {
        this.ctx.beginPath();
        
        switch(style.class) {
            case 'style-einstein':
                this.drawEinsteinTemplate(y);
                break;
            case 'style-jobs':
                this.drawJobsTemplate(y);
                break;
            case 'style-gates':
                this.drawGatesTemplate(y);
                break;
            case 'style-armstrong':
                this.drawArmstrongTemplate(y);
                break;
        }
        
        this.ctx.stroke();
    }

    drawEinsteinTemplate(y) {
        // Einstein's flowing, scientific style
        this.ctx.moveTo(75, y-5);
        this.ctx.bezierCurveTo(80, y-20, 95, y-15, 105, y);
        this.ctx.bezierCurveTo(110, y+10, 105, y+15, 95, y+8);
        this.ctx.moveTo(105, y-5);
        this.ctx.bezierCurveTo(115, y-18, 135, y-10, 145, y+5);
        this.ctx.bezierCurveTo(160, y-25, 185, y+20, 210, y-10);
        this.ctx.bezierCurveTo(230, y-30, 255, y+15, 275, y);
        this.ctx.bezierCurveTo(290, y-15, 310, y+20, 330, y-5);
    }

    drawJobsTemplate(y) {
        // Jobs' clean, minimal style
        this.ctx.moveTo(80, y+10);
        this.ctx.lineTo(80, y-15);
        this.ctx.moveTo(80, y-5);
        this.ctx.bezierCurveTo(95, y-20, 110, y-15, 125, y);
        this.ctx.lineTo(145, y);
        this.ctx.bezierCurveTo(155, y-8, 165, y-5, 175, y+3);
        this.ctx.lineTo(195, y+3);
        this.ctx.bezierCurveTo(205, y-5, 215, y-8, 225, y);
        this.ctx.lineTo(245, y);
    }

    drawGatesTemplate(y) {
        // Gates' technical, angular style
        this.ctx.moveTo(75, y);
        this.ctx.bezierCurveTo(85, y-12, 95, y-15, 105, y-8);
        this.ctx.lineTo(115, y-8);
        this.ctx.bezierCurveTo(125, y-15, 135, y-12, 145, y);
        this.ctx.lineTo(155, y);
        this.ctx.bezierCurveTo(165, y-10, 175, y-8, 185, y+2);
        this.ctx.lineTo(200, y+2);
        this.ctx.bezierCurveTo(210, y-6, 220, y-8, 230, y);
        this.ctx.bezierCurveTo(240, y-5, 250, y-3, 260, y+2);
    }

    drawArmstrongTemplate(y) {
        // Armstrong's bold, confident style
        this.ctx.moveTo(72, y+5);
        this.ctx.bezierCurveTo(78, y-20, 95, y-25, 110, y-10);
        this.ctx.bezierCurveTo(125, y-30, 140, y+15, 155, y-5);
        this.ctx.bezierCurveTo(170, y-25, 185, y+20, 200, y-10);
        this.ctx.bezierCurveTo(215, y-20, 230, y+10, 245, y);
        this.ctx.bezierCurveTo(260, y-15, 275, y+25, 295, y-5);
        this.ctx.bezierCurveTo(305, y-20, 315, y+15, 325, y+5);
    }

    drawRealisticSignatureTemplate(y, style) {
        this.ctx.beginPath();
        
        if (style.class === 'style-realistic') {
            // Natural flowing handwriting
            this.ctx.moveTo(80, y);
            this.ctx.bezierCurveTo(95, y-15, 115, y-20, 135, y-5);
            this.ctx.bezierCurveTo(155, y-25, 175, y+20, 195, y-10);
            this.ctx.bezierCurveTo(215, y-15, 235, y+15, 255, y);
            this.ctx.bezierCurveTo(270, y-10, 285, y+10, 300, y-5);
            
            // Add a realistic loop
            this.ctx.moveTo(240, y-5);
            this.ctx.arc(248, y-5, 8, 0, Math.PI * 2);
            
        } else if (style.class === 'style-business') {
            // Business style with loops
            this.ctx.moveTo(80, y);
            this.ctx.bezierCurveTo(100, y-18, 125, y-22, 150, y-8);
            this.ctx.bezierCurveTo(175, y-28, 200, y+18, 225, y-12);
            
            // Business loops
            this.ctx.moveTo(180, y-10);
            this.ctx.arc(192, y-10, 12, 0, Math.PI * 2);
            this.ctx.moveTo(250, y);
            this.ctx.bezierCurveTo(265, y-15, 280, y+15, 295, y);
            
        } else if (style.class === 'style-doctor') {
            // Doctor style - erratic
            this.ctx.moveTo(90, y);
            this.ctx.bezierCurveTo(100, y-10, 115, y+8, 130, y-12);
            this.ctx.bezierCurveTo(145, y+15, 160, y-8, 175, y+5);
            this.ctx.bezierCurveTo(190, y-15, 205, y+12, 220, y-3);
            this.ctx.bezierCurveTo(235, y+8, 250, y-12, 265, y+6);
            
            // Doctor squiggles
            for (let i = 0; i < 3; i++) {
                const x = 270 + i * 15;
                this.ctx.moveTo(x, y-5);
                this.ctx.quadraticCurveTo(x+5, y-15, x+10, y+5);
                this.ctx.quadraticCurveTo(x+15, y+15, x+20, y-5);
            }
        }
        
        this.ctx.stroke();
    }

    getFontFamily(styleClass) {
        const fontMap = {
            'style-elegant': 'Allura, cursive',
            'style-casual': 'Dancing Script, cursive',
            'style-handwritten': 'Caveat, cursive',
            'style-script-bold': 'Great Vibes, cursive',
            'style-minimalist': 'Kalam, cursive',
            'style-classic': 'Satisfy, cursive',
            'style-business': 'Pacifico, cursive'
        };
        return fontMap[styleClass] || 'Arial, sans-serif';
    }

    downloadPracticeSheet() {
        const link = document.createElement('a');
        link.download = `Unterschrift_Uebung_${this.currentName}_${this.selectedStyle}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    goBack() {
        document.getElementById('practiceSection').style.display = 'none';
        document.getElementById('previewSection').style.display = 'block';
        
        // Reset selection
        document.getElementById('selectStyleBtn').disabled = true;
        document.getElementById('selectStyleBtn').textContent = 'Stil auswählen';
        
        if (this.selectedSignature) {
            this.selectedSignature.classList.remove('selected');
            this.selectedSignature = null;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SignaturePracticeApp();
});

// Handle window resize for canvas
window.addEventListener('resize', () => {
    const app = window.signatureApp;
    if (app && app.canvas) {
        app.setupCanvas();
        app.updatePracticeCanvas();
    }
});
