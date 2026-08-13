/**
 * Accessibility Module
 * Provides text size, high contrast, and dyslexia-friendly font toggles
 * Persists user preferences in localStorage
 */

class AccessibilityManager {
  constructor() {
    this.storageKey = 'barakaloni-a11y-prefs';
    this.defaultPrefs = {
      textSize: 100,
      highContrast: false,
      dyslexiaFont: false,
    };
    this.prefs = this.loadPrefs();
    this.init();
  }

  loadPrefs() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : { ...this.defaultPrefs };
  }

  savePrefs() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.prefs));
  }

  init() {
    this.createButton();
    this.createPanel();
    this.applyPrefs();
    this.attachEventListeners();
  }

  createButton() {
    const button = document.createElement('button');
    button.id = 'accessibility-btn';
    button.className = 'accessibility-btn';
    button.setAttribute('aria-label', 'הנגשה - פתח אפשרויות נגישות (Alt+A)');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'accessibility-panel');
    button.innerHTML = '♿ הנגשה';
    button.setAttribute('type', 'button');
    button.setAttribute('title', 'הנגשה - Alt+A');
    document.body.insertBefore(button, document.body.firstChild);
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'אפשרויות נגישות');
    panel.innerHTML = `
      <div class="accessibility-panel-header">
        <h2>אפשרויות נגישות</h2>
        <button id="accessibility-close" class="accessibility-close" aria-label="סגור תפריט נגישות" type="button">✕</button>
      </div>
      <div class="accessibility-panel-body">
        <div class="a11y-option">
          <label for="text-size-input">גודל טקסט</label>
          <div class="text-size-controls">
            <button class="text-size-btn" data-size="100" aria-label="גודל טקסט נורמלי">A</button>
            <button class="text-size-btn" data-size="130" aria-label="גודל טקסט גדול">A+</button>
            <button class="text-size-btn" data-size="150" aria-label="גודל טקסט גדול מאוד">A++</button>
          </div>
          <span class="size-display" id="size-display">${this.prefs.textSize}%</span>
        </div>
        <div class="a11y-option">
          <label>
            <input type="checkbox" id="high-contrast-toggle" class="a11y-toggle" ${this.prefs.highContrast ? 'checked' : ''}>
            ניגודיות גבוהה
          </label>
        </div>
        <div class="a11y-option">
          <label>
            <input type="checkbox" id="dyslexia-font-toggle" class="a11y-toggle" ${this.prefs.dyslexiaFont ? 'checked' : ''}>
            פונט ידידותי לדיסלקסיה
          </label>
        </div>
      </div>
    `;
    document.body.insertBefore(panel, document.body.firstChild);
  }

  attachEventListeners() {
    const btn = document.getElementById('accessibility-btn');
    const closeBtn = document.getElementById('accessibility-close');
    const panel = document.getElementById('accessibility-panel');
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const dyslexiaToggle = document.getElementById('dyslexia-font-toggle');
    const textSizeBtns = document.querySelectorAll('.text-size-btn');

    // Toggle panel open/close on click
    btn.addEventListener('click', () => {
      this.togglePanel(btn, panel);
    });

    // Toggle panel on Enter/Space keyboard keys
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.togglePanel(btn, panel);
      }
    });

    closeBtn.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
    });

    // Close button keyboard support
    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
      }
    });

    // High contrast toggle
    highContrastToggle.addEventListener('change', () => {
      this.prefs.highContrast = highContrastToggle.checked;
      this.savePrefs();
      this.applyPrefs();
    });

    // Dyslexia font toggle
    dyslexiaToggle.addEventListener('change', () => {
      this.prefs.dyslexiaFont = dyslexiaToggle.checked;
      this.savePrefs();
      this.applyPrefs();
    });

    // Text size buttons
    textSizeBtns.forEach(btnEl => {
      if (btnEl.dataset.size == this.prefs.textSize) {
        btnEl.classList.add('active');
      }
      
      const activateButton = () => {
        const size = parseInt(btnEl.dataset.size);
        this.prefs.textSize = size;
        this.savePrefs();
        this.applyPrefs();
        
        // Update active state
        textSizeBtns.forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
        
        // Update display
        document.getElementById('size-display').textContent = size + '%';
      };
      
      // Click event
      btnEl.addEventListener('click', activateButton);
      
      // Keyboard support (Enter/Space)
      btnEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateButton();
        }
      });
    });

    // Close panel on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        btn.focus();
      }
      
      // Alt+A shortcut to open/close accessibility panel
      if ((e.altKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.togglePanel(btn, panel);
        btn.focus();
      }
    });
  }

  togglePanel(btn, panel) {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
    panel.classList.toggle('open');
  }

  applyPrefs() {
    const root = document.documentElement;
    
    // Apply text size
    root.style.fontSize = (this.prefs.textSize / 100) * 16 + 'px';
    
    // Apply high contrast
    if (this.prefs.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply dyslexia font
    if (this.prefs.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
  });
} else {
  new AccessibilityManager();
}
