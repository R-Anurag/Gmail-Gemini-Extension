function getEmailContent() {
    const selectors = ['h7', '.a3s.aiL', '.gmail_quote', '[role="presentation"]'];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) return content.innerText.trim();
    }
    return '';
}

function findComposeToolbar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null;
}

function createAIButtonWithDropdown(onToneSelected, onClickAI) {
    // default tone
    let selectedTone = "formal"; 

    const container = document.createElement("div");
    container.className = "T-I J-J5-Ji ai-reply-container";
    container.setAttribute("role", "button");
    Object.assign(container.style, {
        display: "inline-flex",
        alignItems: "center",
        marginRight: "8px",
        position: "relative",
        height: "36px",
        borderRadius: "18px",
        overflow: "hidden",
        verticalAlign: "middle",
        color: "#fff",
        userSelect: "none",
        transition: "opacity 0.2s ease-in-out",
        background: "transparent"
    });
    
    // gradient background for ai-feel
    const gradientWrapper = document.createElement("div");
    Object.assign(gradientWrapper.style, {
        position: "absolute",
        inset: 0,
        borderRadius: "18px",
        zIndex: 0,
        background: "linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)",
        backgroundSize: "200% 100%",
        animation: "pulse-gradient 4s ease-in-out infinite"
    });

    // keyframes for animation
    const styleTag = document.createElement("style");
    styleTag.textContent = `
        @keyframes pulse-gradient {
            0% { background-position: 100% 0; }
            50% { background-position: 0% 0; }
            100% { background-position: 100% 0; }
        }
    `;
    document.head.appendChild(styleTag);

    // foreground wrapper
    const foreground = document.createElement("div");
    Object.assign(foreground.style, {
        display: "inline-flex",
        alignItems: "center",
        height: "100%",
        width: "100%",
        position: "relative",
        zIndex: 1
    });

    // main button (AI reply)
    const mainButton = document.createElement("div");
    Object.assign(mainButton.style, {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "0 10px",
        height: "100%",
        cursor: "pointer",
        background: "rgba(0,0,0,0.1)",
        borderRadius: "18px 0 0 18px",
        position: "relative"
    });

    // stars icon
    const iconSpan = document.createElement("span");
    const iconImg = document.createElement("img");
    iconImg.src = chrome.runtime.getURL("images/ai-stars.svg");
    Object.assign(iconImg.style, {
        width: "18px",
        height: "18px",
        display: "block"
    });
    iconSpan.appendChild(iconImg);

    Object.assign(iconSpan.style, {
        color: "white",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px"
    });


    // text label span
    const labelSpan = document.createElement("span");
    labelSpan.textContent = "AI Reply";
    Object.assign(labelSpan.style, {
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "32px",
        color: "white",
        display: "inline-block"
    });

    // selected-tone chip 
    const chip = document.createElement("span");
    chip.textContent = "Formal";
    Object.assign(chip.style, {
        background: "rgba(255,255,255,0.18)",
        borderRadius: "12px",
        padding: "2px 6px",
        fontSize: "11px",
        fontWeight: "500",
        lineHeight: "1",
        color: "white",
        display: "inline-flex",
        alignItems: "center"
    });

    mainButton.appendChild(iconSpan);
    mainButton.appendChild(labelSpan);
    mainButton.appendChild(chip);

    // dropdown-button
    const dropdownBtn = document.createElement("div");
    dropdownBtn.innerHTML = "&#9662;";
    Object.assign(dropdownBtn.style, {
        padding: "4px 8px",
        borderLeft: "1px solid rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background 0.15s"
    });

    dropdownBtn.addEventListener("mouseenter", () => {
        dropdownBtn.style.background = "rgba(255,255,255,0.15)";
    });
    dropdownBtn.addEventListener("mouseleave", () => {
        dropdownBtn.style.background = "transparent";
    });

    // dropdown menu
    const menu = document.createElement("div");
    menu.className = "ai-tone-menu";
    Object.assign(menu.style, {
        position: "fixed",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        display: "none",
        zIndex: "999999",
        minWidth: "180px",
        opacity: "0",
        transform: "translateY(-6px)",
        transition: "opacity 0.16s ease, transform 0.16s ease"
    });

    const options = [
        { value: "formal",   label: "Formal" },
        { value: "casual",   label: "Casual" },
        { value: "friendly", label: "Friendly" },
        { value: "custom",   label: "Custom..." }
    ];

    function renderOptions() {
        menu.innerHTML = "";
        options.forEach(opt => {
            const item = document.createElement("div");
            item.textContent = opt.label;
            Object.assign(item.style, {
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
                background: opt.value === selectedTone ? "#0b57d0" : "white",
                color: opt.value === selectedTone ? "white" : "black"
            });
            item.addEventListener("mouseenter", () => {
                if (opt.value !== selectedTone) item.style.background = "#f5f5f5";
            });
            item.addEventListener("mouseleave", () => {
                item.style.background = opt.value === selectedTone ? "#0b57d0" : "white";
            });
            item.addEventListener("click", (e) => {
                e.stopPropagation();
                hideMenu();
                if (opt.value === "custom") {
                    showCustomTonePopup((tone) => {
                        selectedTone = tone;
                        chip.textContent = "Custom";
                        onToneSelected(tone);
                        renderOptions();
                    });
                } else {
                    selectedTone = opt.value;
                    chip.textContent = opt.label;
                    onToneSelected(opt.value);
                    renderOptions();
                }
            });
            menu.appendChild(item);
        });
    }

    let boundUpdatePosition = null;
    let docClickHandler = null;
    let keydownHandler = null;

    function updateMenuPosition() {
        if (menu.style.display !== "block") return;
        const rect = container.getBoundingClientRect();
        const menuHeight = menu.scrollHeight || 150;
        const menuWidth = Math.max(menu.offsetWidth || 0, container.offsetWidth);
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        let openUp = spaceAbove > menuHeight + 10;
        let top;
        if (openUp) {
            top = rect.top - menuHeight - 6;
        } else {
            top = rect.bottom + 6;
        }
        let left = rect.left;
        if (left + menuWidth > viewportWidth - 8) {
            left = Math.max(8, viewportWidth - menuWidth - 8);
        }
        if (left < 8) left = 8;
        menu.style.left = `${Math.round(left)}px`;
        menu.style.top = `${Math.round(top)}px`;
        menu.dataset.openUp = openUp ? "true" : "false";
        dropdownBtn.innerHTML = openUp ? "&#9652;" : "&#9662;";
    }

    function showMenu() {
        renderOptions();
        menu.style.minWidth = `${container.offsetWidth}px`;
        menu.style.display = "block";
        updateMenuPosition();
        const openUp = menu.dataset.openUp === "true";
        menu.style.transform = openUp ? "translateY(8px)" : "translateY(-8px)";
        menu.style.opacity = "0";
        requestAnimationFrame(() => {
            menu.style.opacity = "1";
            menu.style.transform = "translateY(0)";
        });
        boundUpdatePosition = updateMenuPosition;
        window.addEventListener("scroll", boundUpdatePosition, true);
        window.addEventListener("resize", boundUpdatePosition);
        docClickHandler = (e) => {
            if (!menu.contains(e.target) && !container.contains(e.target)) {
                hideMenu();
            }
        };
        document.addEventListener("click", docClickHandler);
        keydownHandler = (e) => { if (e.key === "Escape") hideMenu(); };
        document.addEventListener("keydown", keydownHandler);
    }

    function hideMenu() {
        const openUp = menu.dataset.openUp === "true";
        menu.style.opacity = "0";
        menu.style.transform = openUp ? "translateY(8px)" : "translateY(-8px)";
        setTimeout(() => { menu.style.display = "none"; }, 160);
        if (boundUpdatePosition) {
            window.removeEventListener("scroll", boundUpdatePosition, true);
            window.removeEventListener("resize", boundUpdatePosition);
            boundUpdatePosition = null;
        }
        if (docClickHandler) {
            document.removeEventListener("click", docClickHandler);
            docClickHandler = null;
        }
        if (keydownHandler) {
            document.removeEventListener("keydown", keydownHandler);
            keydownHandler = null;
        }
        dropdownBtn.innerHTML = "&#9662;";
    }

    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menu.style.display === "block") hideMenu();
        else showMenu();
    });

    mainButton.addEventListener("click", (e) => {
        e.stopPropagation();
        onClickAI();
    });

    menu.addEventListener("click", (e) => e.stopPropagation());

    document.body.appendChild(menu);

    foreground.appendChild(mainButton);
    foreground.appendChild(dropdownBtn);
    container.appendChild(gradientWrapper);
    container.appendChild(foreground);

    function destroy() {
        try {
            hideMenu();
            menu.remove();
        } catch (e) { /* ignore */ }
    }

    return { container, mainButton, labelSpan, chip, destroy, gradientWrapper, dropdownBtn };
}

function showCustomTonePopup(onSubmit) {
    const popup = document.createElement("div");
    Object.assign(popup.style, {
        position: "fixed",
        bottom: "60px",
        right: "60px",
        width: "420px",
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "14px",
        color: "#202124",
        zIndex: "1000000",
        overflow: "hidden",
        border: "2px solid transparent",
        backgroundImage: "linear-gradient(white, white), linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        animation: "pulse-gradient 4s ease-in-out infinite"
    });

    const header = document.createElement("div");
    header.textContent = "Describe Your Style Here";
    Object.assign(header.style, {
        fontWeight: "600",
        fontSize: "16px",
        padding: "14px 18px",
        borderBottom: "1px solid #eee",
        background: "rgba(0,0,0,0.02)"
    });

    const content = document.createElement("div");
    Object.assign(content.style, { padding: "16px" });

    const textarea = document.createElement("textarea");
    textarea.placeholder = "e.g. Apologetic but persuasive, Dwight from The Office...";
    Object.assign(textarea.style, {
        width: "100%",
        height: "100px",
        padding: "12px",
        fontSize: "14px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        resize: "vertical",
        outline: "none",
        boxSizing: "border-box",
        fontFamily: "inherit",
        transition: "border 0.2s, box-shadow 0.2s"
    });
    textarea.addEventListener("focus", () => {
        textarea.style.border = "1px solid #2575fc";
        textarea.style.boxShadow = "0 0 0 2px rgba(37,117,252,0.2)";
    });
    textarea.addEventListener("blur", () => {
        textarea.style.border = "1px solid #ddd";
        textarea.style.boxShadow = "none";
    });

    const actions = document.createElement("div");
    Object.assign(actions.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "14px 18px",
        borderTop: "1px solid #eee",
        background: "rgba(0,0,0,0.02)"
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    Object.assign(cancelBtn.style, {
        background: "transparent",
        border: "none",
        color: "#6a11cb",
        fontWeight: "500",
        fontSize: "14px",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "12px",
        transition: "background 0.2s"
    });
    cancelBtn.addEventListener("mouseenter", () => cancelBtn.style.background = "rgba(106,17,203,0.08)");
    cancelBtn.addEventListener("mouseleave", () => cancelBtn.style.background = "transparent");
    cancelBtn.addEventListener("click", () => popup.remove());

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    Object.assign(okButton.style, {
        background: "linear-gradient(90deg, #6a11cb, #2575fc, #6a11cb)",
        backgroundSize: "200% 100%",
        animation: "pulse-gradient 4s ease-in-out infinite",
        border: "none",
        color: "white",
        fontWeight: "500",
        fontSize: "14px",
        padding: "8px 20px",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "opacity 0.2s"
    });
    okButton.addEventListener("mouseenter", () => okButton.style.opacity = "0.85");
    okButton.addEventListener("mouseleave", () => okButton.style.opacity = "1");

    okButton.addEventListener("click", () => {
        const customTone = textarea.value.trim();
        if (customTone) onSubmit(customTone);
        popup.remove();
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(okButton);
    content.appendChild(textarea);
    popup.appendChild(header);
    popup.appendChild(content);
    popup.appendChild(actions);
    document.body.appendChild(popup);

    textarea.focus();
}


// ---- Injecting into Gmail ----
function injectButton() {
    const oldBtn = document.querySelector('.ai-reply-container');
    if (oldBtn) oldBtn.remove();
    const oldMenu = document.querySelector('.ai-tone-menu');
    if (oldMenu) oldMenu.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) return;

    // Skipping if this is a new compose (not message reply)
    const composeDialog = toolbar.closest('[role="dialog"]');
    if (composeDialog) {
        console.log("Skipping AI button (new compose detected)");
        return;
    }

    let selectedTone = "formal";

    const created = createAIButtonWithDropdown(
        (tone) => { selectedTone = tone; console.log("Tone set:", tone); },
        async () => {
            const { labelSpan, container } = created;
            const emailContent = getEmailContent();

            labelSpan.textContent = "Generating...";
            container.style.opacity = "0.7";
            container.style.pointerEvents = "none";

            try {
                const response = await fetch('http://localhost:8080/api/email/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailContent, tone: selectedTone })
                });

                const generatedReply = await response.text();
                const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
                if (composeBox) {
                    composeBox.focus();
                    composeBox.innerHTML = "";
                    document.execCommand("insertText", false, generatedReply);
                }
            } catch (err) {
                console.error("AI error:", err);
            } finally {
                labelSpan.textContent = "AI Reply";
                container.style.opacity = "1";
                container.style.pointerEvents = "auto";
            }
        }
    );

    const cleanupObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const removed of mutation.removedNodes) {
                if (removed.contains && removed.contains(created.container)) {
                    created.destroy();
                    cleanupObserver.disconnect();
                }
            }
        }
    });
    cleanupObserver.observe(document.body, { childList: true, subtree: true });


    toolbar.insertBefore(created.container, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some((node) => {
            return node.nodeType === Node.ELEMENT_NODE &&
                (node.matches('.btC, .aDh, [role="dialog"]') ||
                 (node.querySelector && node.querySelector('.btC, .aDh, [role="dialog"]')));
        });

        if (hasComposeElements) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
