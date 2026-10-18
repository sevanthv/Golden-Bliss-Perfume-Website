// ===================================================
// GOLDEN BLISS - SCENT FINDER INTERACTIVE QUIZ
// ===================================================

const quizQuestions = [
    {
        id: 1,
        question: "What vibe or mood resonates with you most?",
        subtitle: "Select the atmosphere you want your fragrance to radiate.",
        options: [
            { label: "🌹 Romantic & Sensual", desc: "Velvety floral, warm vanilla and seductive evening allure.", target: ["1", "6"] },
            { label: "🌲 Regal & Commanding", desc: "Smoky oud, rich amber and precious woodcraft.", target: ["2", "4"] },
            { label: "🌊 Fresh & Liberating", desc: "Salty sea breezes, bright lemons and coastal botanicals.", target: ["3", "8"] },
            { label: "✨ Intimate & Sophisticated", desc: "Creamy sandalwood, spiced coffee and modern woods.", target: ["5", "7"] }
        ]
    },
    {
        id: 2,
        question: "When and where will you primarily wear this scent?",
        subtitle: "Every unforgettable memory deserves its own scent trail.",
        options: [
            { label: "🌙 Evening Soirées & Date Nights", desc: "Hypnotic, long-lasting and magnetic presence.", target: ["1", "4", "7"] },
            { label: "🏛️ Luxury Galas & High-Profile Events", desc: "Majestic, rare extrait projection and authority.", target: ["2", "4"] },
            { label: "☀️ Daily Signature & Office Elegance", desc: "Subtle, invigorating, effortlessly clean.", target: ["3", "5", "8"] },
            { label: "🌸 Special Occasions & Spring Celebrations", desc: "Ethereal jasmine, peony and delicate blossoms.", target: ["6", "1"] }
        ]
    },
    {
        id: 3,
        question: "Which sensory note combination captivates your heart?",
        subtitle: "Choose the olfactory elements that make you feel exceptional.",
        options: [
            { label: "Vanilla, Damask Rose & White Musk", desc: "Sweet, intoxicating luxury floral.", target: ["1", "6"] },
            { label: "Oud, Golden Amber & Mysore Sandalwood", desc: "Deep, smokey royal oriental woody blend.", target: ["2", "4"] },
            { label: "Amalfi Citrus, Sea Salt & Crisp Mint", desc: "Ultra-refreshing, luminous aquatic harmony.", target: ["3", "8"] },
            { label: "Cardamom, Espresso, Tonka & Cedar", desc: "Warm gourmand spice and cozy sophistication.", target: ["7", "5"] }
        ]
    }
];

let currentQuizStep = 0;
let quizScores = {};

function initQuiz() {
    currentQuizStep = 0;
    quizScores = {};
    perfumeProducts.forEach(p => quizScores[p.id] = 0);
    renderQuizStep();
}

function renderQuizStep() {
    const quizContainer = document.getElementById('quizStepContainer');
    const resultContainer = document.getElementById('quizResultContainer');
    const progressEl = document.getElementById('quizStepProgress');

    if (!quizContainer || !resultContainer) return;

    if (currentQuizStep >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';

    const currentQ = quizQuestions[currentQuizStep];
    if (progressEl) {
        progressEl.textContent = `Question ${currentQuizStep + 1} of ${quizQuestions.length}`;
    }

    quizContainer.innerHTML = `
        <div class="quiz-question-card">
            <span class="quiz-step-tag">Step ${currentQuizStep + 1}</span>
            <h3 class="quiz-question-title">${currentQ.question}</h3>
            <p class="quiz-question-subtitle">${currentQ.subtitle}</p>
            <div class="quiz-options-grid">
                ${currentQ.options.map((opt, i) => `
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(${i})">
                        <span class="quiz-option-title">${opt.label}</span>
                        <span class="quiz-option-desc">${opt.desc}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function handleQuizAnswer(optionIndex) {
    const currentQ = quizQuestions[currentQuizStep];
    const selectedOption = currentQ.options[optionIndex];

    selectedOption.target.forEach(id => {
        if (quizScores[id] !== undefined) {
            quizScores[id] += 3;
        }
    });

    currentQuizStep++;
    renderQuizStep();
}

function showQuizResult() {
    const quizContainer = document.getElementById('quizStepContainer');
    const resultContainer = document.getElementById('quizResultContainer');
    const progressEl = document.getElementById('quizStepProgress');

    if (!quizContainer || !resultContainer) return;

    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    if (progressEl) progressEl.textContent = 'Curated Just For You ✨';

    // Find highest score
    let highestId = "1";
    let maxScore = -1;
    for (const [id, score] of Object.entries(quizScores)) {
        if (score > maxScore) {
            maxScore = score;
            highestId = id;
        }
    }

    const matchedPerfume = getPerfumeById(highestId) || perfumeProducts[0];
    const defaultPrice = matchedPerfume.sizes[1] ? matchedPerfume.sizes[1].price : matchedPerfume.sizes[0].price;

    resultContainer.innerHTML = `
        <div class="quiz-result-card">
            <div class="quiz-result-badge">99% Fragrance Match</div>
            <div class="quiz-result-content">
                <div class="quiz-result-img-box">
                    <img src="${matchedPerfume.image}" alt="${matchedPerfume.name}">
                </div>
                <div class="quiz-result-info">
                    <span class="quiz-family-tag">${matchedPerfume.family.toUpperCase()} • ${matchedPerfume.gender.toUpperCase()}</span>
                    <h2>${matchedPerfume.name}</h2>
                    <p class="quiz-result-sub">${matchedPerfume.subtitle}</p>
                    <p class="quiz-result-desc">${matchedPerfume.description}</p>
                    
                    <div class="quiz-notes-preview">
                        <strong>Signature Notes:</strong>
                        <div class="notes-tags-row">
                            ${matchedPerfume.notes.heart.map(n => `<span class="note-pill">${n}</span>`).join('')}
                            ${matchedPerfume.notes.base.slice(0, 2).map(n => `<span class="note-pill">${n}</span>`).join('')}
                        </div>
                    </div>

                    <div class="quiz-result-price-row">
                        <span class="quiz-price">₹${defaultPrice.toLocaleString('en-IN')} <small>(${matchedPerfume.defaultSize})</small></span>
                    </div>

                    <div class="quiz-result-actions">
                        <button class="btn-primary" onclick="addToCart('${matchedPerfume.id}', '${matchedPerfume.defaultSize}', 1)">
                            🛍️ Add Signature Scent to Bag
                        </button>
                        <button class="btn-secondary" onclick="openQuickView('${matchedPerfume.id}')">
                            🔍 View Full Scent Profile
                        </button>
                        <button class="quiz-retake-btn" onclick="initQuiz()">
                            🔄 Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
