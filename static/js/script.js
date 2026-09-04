// ============================
// STATE
// ============================
let selectedPlatform = "Instagram";
let selectedTone = "Witty";
const HISTORY_KEY = "tone_transformer_history";

// ============================
// THEME TOGGLE
// ============================
const themeToggle = document.getElementById("theme_toggle");
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

// ============================
// PLATFORM CARD BUTTONS
// ============================
const platformButtons = document.querySelectorAll("#platform_tabs .card-btn");
platformButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        platformButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedPlatform = btn.dataset.value;
    });
});

// ============================
// TONE LIST BUTTONS
// ============================
const toneButtons = document.querySelectorAll("#tone_tabs .list-btn");
toneButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        toneButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTone = btn.dataset.value;
    });
});

// ============================
// SLIDERS
// ============================
const tempSlider = document.getElementById("temperature");
const topPSlider = document.getElementById("top_p");

tempSlider.addEventListener("input", () => {
    document.getElementById("temp_val").innerText = tempSlider.value;
});

topPSlider.addEventListener("input", () => {
    document.getElementById("top_p_val").innerText = topPSlider.value;
});

// ============================
// TOAST NOTIFICATION
// ============================
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = "toast hidden";
    }, 2800);
}

// ============================
// HISTORY (localStorage)
// ============================
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveToHistory(entry) {
    const history = getHistory();
    history.unshift(entry);
    if (history.length > 10) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById("history_list");
    const history = getHistory();

    if (history.length === 0) {
        list.innerHTML = `<p class="empty-hint">No previous generations yet.</p>`;
        return;
    }

    list.innerHTML = history.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="h-meta">
                <span>${item.platform} · ${item.tone}</span>
                <span>${item.time}</span>
            </div>
            <div class="h-preview">${item.product}: ${item.copy.slice(0, 60)}...</div>
        </div>
    `).join("");

    document.querySelectorAll(".history-item").forEach(el => {
        el.addEventListener("click", () => {
            const idx = el.dataset.index;
            const item = getHistory()[idx];
            renderOutput(item.copy);
            showToast("Loaded from history", "success");
        });
    });
}

document.getElementById("clear_history").addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    showToast("History cleared", "success");
});

renderHistory();

// ============================
// OUTPUT RENDERING
// ============================
function renderOutput(text, isError = false) {
    const box = document.getElementById("output_box");
    box.classList.add("filled");

    if (isError) {
        box.innerHTML = `<p class="error-text">⚠️ ${text}</p>`;
    } else {
        box.textContent = text;
    }

    document.getElementById("char_count").textContent = `${text.length} chars`;
}

// ============================
// COPY TO CLIPBOARD
// ============================
document.getElementById("copy_btn").addEventListener("click", () => {
    const box = document.getElementById("output_box");
    const text = box.textContent.trim();

    if (!text || text.includes("will appear here")) {
        showToast("Nothing to copy yet", "error");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => showToast("Copied to clipboard!", "success"))
        .catch(() => showToast("Copy failed", "error"));
});

// ============================
// GENERATE COPY (API CALL)
// ============================
const generateBtn = document.getElementById("generate_btn");
const btnText = document.getElementById("btn_text");
const btnSpinner = document.getElementById("btn_spinner");

generateBtn.addEventListener("click", async () => {
    const product_name = document.getElementById("product_name").value.trim();
    const description = document.getElementById("description").value.trim();
    const temperature = tempSlider.value;
    const top_p = topPSlider.value;

    if (!product_name || !description) {
        showToast("Please fill Product Name and Description", "error");
        return;
    }

    // Loading state
    generateBtn.disabled = true;
    btnText.textContent = "Generating...";
    btnSpinner.classList.remove("hidden");

    try {
        const res = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_name,
                description,
                platform: selectedPlatform,
                tone: selectedTone,
                temperature,
                top_p
            })
        });

        const data = await res.json();

        if (data.success) {
            renderOutput(data.copy);
            saveToHistory({
                product: product_name,
                platform: selectedPlatform,
                tone: selectedTone,
                copy: data.copy,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            });
            showToast("Copy generated successfully!", "success");
        } else {
            renderOutput(data.error || "Something went wrong", true);
            showToast("Generation failed", "error");
        }
    } catch (err) {
        renderOutput("Could not reach the server. Is Flask running?", true);
        showToast("Request failed", "error");
    }

    // Reset button
    generateBtn.disabled = false;
    btnText.textContent = "Generate Copy 🚀";
    btnSpinner.classList.add("hidden");
});