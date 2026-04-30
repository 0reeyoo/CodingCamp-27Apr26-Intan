/**
 * Aplikasi Pelacak Pengeluaran Harian
 * Mobile-friendly expense tracker dengan fitur lengkap
 */

// ===== Constants =====
const STORAGE_KEY = 'expense_tracker_data';
const DEFAULT_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan', 'Kesehatan', 'Belanja'];
const CHART_COLORS = [
    '#FF9800', '#2196F3', '#4CAF50', '#FF5722', '#9C27B0',
    '#00BCD4', '#FFEB3B', '#795548', '#607D8B', '#E91E63'
];

// ===== DOM Elements =====
const themeToggle = document.getElementById('themeToggle');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalAmount = document.getElementById('totalAmount');
const sortBy = document.getElementById('sortBy');
const filterCategory = document.getElementById('filterCategory');
const categoryChart = document.getElementById('categoryChart');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const transactionDate = document.getElementById('transactionDate');
const newCategoryBtn = document.getElementById('newCategoryBtn');
const newCategoryGroup = document.getElementById('newCategoryGroup');
const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const transactionCategory = document.getElementById('transactionCategory');
const newCategoryName = document.getElementById('newCategoryName');
const summaryMonth = document.getElementById('summaryMonth');
const summaryContent = document.getElementById('summaryContent');
const budgetLimit = document.getElementById('budgetLimit');
const saveBudgetBtn = document.getElementById('saveBudgetBtn');
const budgetInfo = document.getElementById('budgetInfo');
const budgetWarning = document.getElementById('budgetWarning');
const categoriesList = document.getElementById('categoriesList');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const clearDataBtn = document.getElementById('clearDataBtn');
const monthlySummaryCard = document.getElementById('monthlySummaryCard');

// ===== App State =====
class ExpenseTracker {
    constructor() {
        this.transactions = [];
        this.categories = [...DEFAULT_CATEGORIES];
        this.budgetLimit = 1000000;
        this.loadData();
        this.init();
    }

    // ===== Data Management =====
    loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.transactions = data.transactions || [];
                this.categories = data.categories || [...DEFAULT_CATEGORIES];
                this.budgetLimit = data.budgetLimit || 1000000;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.resetData();
        }
    }

    saveData() {
        try {
            const data = {
                transactions: this.transactions,
                categories: this.categories,
                budgetLimit: this.budgetLimit
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Gagal menyimpan data ke Local Storage');
        }
    }

    resetData() {
        this.transactions = [];
        this.categories = [...DEFAULT_CATEGORIES];
        this.budgetLimit = 1000000;
        localStorage.removeItem(STORAGE_KEY);
    }

    // ===== Transaction Management =====
    addTransaction(name, amount, category, date, note) {
        const transaction = {
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date,
            note,
            createdAt: new Date().toISOString()
        };
        this.transactions.push(transaction);
        this.saveData();
        return transaction;
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveData();
    }

    getTransactions() {
        return this.transactions;
    }

    // ===== Category Management =====
    addCategory(name) {
        if (name.trim() && !this.categories.includes(name)) {
            this.categories.push(name);
            this.saveData();
            return true;
        }
        return false;
    }

    deleteCategory(name) {
        if (this.categories.includes(name) && this.categories.length > 1) {
            this.categories = this.categories.filter(c => c !== name);
            this.saveData();
            return true;
        }
        return false;
    }

    // ===== Calculations =====
    getTotalAmount() {
        return this.transactions.reduce((sum, t) => sum + t.amount, 0);
    }

    getMonthTotal(year, month) {
        return this.transactions
            .filter(t => {
                const d = new Date(t.date);
                return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getDayTotal(date) {
        return this.transactions
            .filter(t => t.date === date)
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getCategoryTotal(category) {
        return this.transactions
            .filter(t => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
    }

    getCategoryDistribution() {
        const distribution = {};
        this.transactions.forEach(t => {
            distribution[t.category] = (distribution[t.category] || 0) + t.amount;
        });
        return distribution;
    }

    // ===== Initialization =====
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.loadTheme();
        this.setupDateInput();
    }

    setupEventListeners() {
        // Form submission
        transactionForm.addEventListener('submit', (e) => this.handleAddTransaction(e));

        // Theme toggle
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Tab navigation
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Sorting and filtering
        sortBy.addEventListener('change', () => this.renderTransactions());
        filterCategory.addEventListener('change', () => this.renderTransactions());

        // Category management
        newCategoryBtn.addEventListener('click', () => this.showNewCategoryInput());
        cancelCategoryBtn.addEventListener('click', () => this.hideNewCategoryInput());
        saveCategoryBtn.addEventListener('click', () => this.handleSaveCategory());

        // Summary
        summaryMonth.addEventListener('change', () => this.renderMonthlySummary());

        // Settings
        saveBudgetBtn.addEventListener('click', () => this.handleSaveBudget());
        exportBtn.addEventListener('click', () => this.handleExportData());
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', (e) => this.handleImportData(e));
        clearDataBtn.addEventListener('click', () => this.handleClearData());
    }

    setupDateInput() {
        const today = new Date().toISOString().split('T')[0];
        transactionDate.value = today;
        const now = new Date();
        summaryMonth.valueAsDate = now;
        // Gunakan format string YYYY-MM untuk kompatibilitas yang lebih baik
        summaryMonth.value = today.substring(0, 7);
    }

    // ===== Event Handlers =====
    handleAddTransaction(e) {
        e.preventDefault();

        const name = document.getElementById('transactionName').value.trim();
        const amount = document.getElementById('transactionAmount').value;
        const category = document.getElementById('transactionCategory').value;
        const date = document.getElementById('transactionDate').value;
        const note = document.getElementById('transactionNote').value.trim();

        if (!name || !amount || !category || !date) {
            alert('Harap isi semua field yang diperlukan');
            return;
        }

        this.addTransaction(name, amount, category, date, note);
        transactionForm.reset();
        transactionDate.value = new Date().toISOString().split('T')[0];
        this.updateUI();
        this.switchTab('dashboard');

        // Show success message
        const formMsg = document.createElement('div');
        formMsg.textContent = '✓ Transaksi berhasil ditambahkan';
        formMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(formMsg);
        setTimeout(() => formMsg.remove(), 3000);
    }

    handleSaveCategory() {
        const name = newCategoryName.value.trim();
        if (!name) {
            alert('Harap masukkan nama kategori');
            return;
        }

        if (this.addCategory(name)) {
            newCategoryName.value = '';
            this.hideNewCategoryInput();
            this.updateCategorySelects();
            this.updateUI();
        } else {
            alert('Kategori sudah ada atau invalid');
        }
    }

    handleSaveBudget() {
        const limit = parseFloat(budgetLimit.value);
        if (limit > 0) {
            this.budgetLimit = limit;
            this.saveData();
            this.updateBudgetInfo();
            this.updateUI();
            alert('Batas pengeluaran berhasil disimpan');
        } else {
            alert('Harap masukkan jumlah yang valid');
        }
    }

    handleExportData() {
        const data = {
            transactions: this.transactions,
            categories: this.categories,
            budgetLimit: this.budgetLimit,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    handleImportData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.transactions && data.categories) {
                    this.transactions = data.transactions || [];
                    this.categories = data.categories || [...DEFAULT_CATEGORIES];
                    this.budgetLimit = data.budgetLimit || 1000000;
                    this.saveData();
                    this.updateUI();
                    alert('Data berhasil diimpor');
                } else {
                    alert('Format file tidak valid');
                }
            } catch (error) {
                alert('Gagal membaca file: ' + error.message);
            }
        };
        reader.readAsText(file);
        importFile.value = '';
    }

    handleClearData() {
        if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
            this.resetData();
            this.updateUI();
            alert('Semua data telah dihapus');
        }
    }

    // ===== UI Updates =====
    updateUI() {
        this.updateTotals();
        this.renderTransactions();
        this.renderChart();
        this.updateCategorySelects();
        this.updateBudgetInfo();
        this.renderCategoriesList();
        this.checkBudgetWarning();
    }

    updateTotals() {
        const total = this.getTotalAmount();
        totalAmount.textContent = this.formatCurrency(total);
        this.renderMonthlySummaryCard();
    }

    renderTransactions() {
        let transactions = [...this.transactions];

        // Filter by category
        const selectedCategory = filterCategory.value;
        if (selectedCategory) {
            transactions = transactions.filter(t => t.category === selectedCategory);
        }

        // Sort
        const sort = sortBy.value;
        switch (sort) {
            case 'date-asc':
                transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                transactions.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-asc':
                transactions.sort((a, b) => a.amount - b.amount);
                break;
            case 'category':
                transactions.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'date-desc':
            default:
                transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        if (transactions.length === 0) {
            transactionList.innerHTML = '<p class="empty-state">Belum ada transaksi. Mulai tambahkan pengeluaran Anda!</p>';
            return;
        }

        const dailyBudget = this.budgetLimit / 30;
        transactionList.innerHTML = transactions.map(t => {
            const isHighlighted = t.amount > dailyBudget;
            return `
                <div class="transaction-item ${isHighlighted ? 'highlighted' : ''}">
                    <div class="transaction-left">
                        <div class="transaction-name">${this.escapeHtml(t.name)}</div>
                        <div class="transaction-meta">
                            <span class="transaction-category" style="background-color: ${this.getCategoryColor(t.category)}; color: white;">
                                ${this.escapeHtml(t.category)}
                            </span>
                            <span>${this.formatDate(t.date)}</span>
                            ${t.note ? `<span>📝 ${this.escapeHtml(t.note)}</span>` : ''}
                        </div>
                    </div>
                    <div class="transaction-right">
                        <div class="transaction-amount">-${this.formatCurrency(t.amount)}</div>
                        <button class="transaction-delete" data-id="${t.id}" title="Hapus">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add delete event listeners
        document.querySelectorAll('.transaction-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                if (confirm('Hapus transaksi ini?')) {
                    this.deleteTransaction(id);
                    this.updateUI();
                }
            });
        });
    }

    renderChart() {
        const distribution = this.getCategoryDistribution();
        const categories = Object.keys(distribution);

        if (categories.length === 0) {
            categoryChart.getContext('2d').clearRect(0, 0, categoryChart.width, categoryChart.height);
            return;
        }

        const ctx = categoryChart.getContext('2d');
        const amounts = Object.values(distribution);
        const colors = categories.map((cat, idx) => CHART_COLORS[idx % CHART_COLORS.length]);

        this.drawPieChart(ctx, amounts, categories, colors);
    }

    renderMonthlySummaryCard() {
        const now = new Date();
        const distribution = {};
        
        this.transactions
            .filter(t => {
                const d = new Date(t.date);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            })
            .forEach(t => {
                distribution[t.category] = (distribution[t.category] || 0) + t.amount;
            });

        const categories = Object.entries(distribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (categories.length === 0) {
            monthlySummaryCard.innerHTML = '<div class="summary-placeholder">-</div>';
            return;
        }

        monthlySummaryCard.innerHTML = categories.map(([category, amount]) => `
            <div class="summary-category-item">
                <span class="category-label">${this.escapeHtml(category)}</span>
                <span class="category-amount">${this.formatCurrency(amount)}</span>
            </div>
        `).join('');
    }

    drawPieChart(ctx, amounts, labels, colors) {
        const width = categoryChart.width;
        const height = categoryChart.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;

        ctx.clearRect(0, 0, width, height);

        const total = amounts.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;

        // Draw slices
        amounts.forEach((amount, idx) => {
            const sliceAngle = (amount / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[idx];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

            const percentage = ((amount / total) * 100).toFixed(0);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(percentage + '%', labelX, labelY);

            currentAngle += sliceAngle;
        });

        // Draw legend
        let legendY = 20;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        labels.forEach((label, idx) => {
            ctx.fillStyle = colors[idx];
            ctx.fillRect(10, legendY, 12, 12);
            ctx.fillStyle = this.getTextColor();
            ctx.fillText(label + ' ' + this.formatCurrency(amounts[idx]), 30, legendY + 6);
            legendY += 20;
        });
    }

    renderMonthlySummary() {
        const val = summaryMonth.value; // Format: "YYYY-MM"
        if (!val) {
            summaryContent.innerHTML = '<p class="empty-state">Silakan pilih bulan terlebih dahulu</p>';
            return;
        }

        // Memecah string "YYYY-MM" secara manual untuk menghindari masalah timezone
        const [year, monthNum] = val.split('-').map(Number);
        const month = monthNum - 1; // JavaScript menggunakan 0-indexed month (0-11)

        const monthTransactions = this.transactions.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });

        if (monthTransactions.length === 0) {
            summaryContent.innerHTML = '<p class="empty-state">Tidak ada transaksi di bulan ini</p>';
            return;
        }

        // Calculate category totals
        const categoryTotals = {};
        const categoryCounts = {};
        monthTransactions.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
            categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
        });

        const monthTotal = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

        let html = '';
        Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, amount]) => {
                html += `
                    <div class="summary-item">
                        <div class="summary-item-left">
                            <div class="summary-category">${this.escapeHtml(category)}</div>
                            <div class="summary-count">${categoryCounts[category]} transaksi</div>
                        </div>
                        <div class="summary-amount">${this.formatCurrency(amount)}</div>
                    </div>
                `;
            });

        html += `
            <div class="summary-total">
                <div class="summary-total-label">Total Pengeluaran</div>
                <div class="summary-total-amount">${this.formatCurrency(monthTotal)}</div>
            </div>
        `;

        summaryContent.innerHTML = html;
    }

    updateCategorySelects() {
        const options = this.categories.map(cat => `<option value="${this.escapeHtml(cat)}">${this.escapeHtml(cat)}</option>`).join('');
        transactionCategory.innerHTML = '<option value="">Pilih Kategori...</option>' + options;
        filterCategory.innerHTML = '<option value="">Semua Kategori</option>' + options;
    }

    updateBudgetInfo() {
        budgetLimit.value = this.budgetLimit;
        const monthTotal = this.getMonthTotal(new Date().getFullYear(), new Date().getMonth());
        const percentage = ((monthTotal / this.budgetLimit) * 100).toFixed(1);
        budgetInfo.textContent = `Pengeluaran bulan ini: ${this.formatCurrency(monthTotal)} (${percentage}% dari batas)`;
    }

    renderCategoriesList() {
        categoriesList.innerHTML = this.categories.map(cat => `
            <div class="category-item">
                <span class="category-name">${this.escapeHtml(cat)}</span>
                <button class="category-delete" data-category="${this.escapeHtml(cat)}" ${this.categories.length === 1 ? 'disabled' : ''}>Hapus</button>
            </div>
        `).join('');

        document.querySelectorAll('.category-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                if (confirm(`Hapus kategori "${category}"?`)) {
                    this.deleteCategory(category);
                    this.updateUI();
                }
            });
        });
    }

    checkBudgetWarning() {
        const now = new Date();
        const monthTotal = this.getMonthTotal(now.getFullYear(), now.getMonth());
        if (monthTotal > this.budgetLimit) {
            const excess = monthTotal - this.budgetLimit;
            budgetWarning.textContent = `⚠️ Pengeluaran Anda telah melebihi batas sebesar ${this.formatCurrency(excess)}!`;
            budgetWarning.style.display = 'flex';
        } else {
            budgetWarning.style.display = 'none';
        }
    }

    // ===== UI Actions =====
    switchTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        document.body.classList.toggle('add-focused', tabName === 'add');

        if (tabName === 'summary') {
            this.renderMonthlySummary();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme_preference', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        this.renderChart();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme_preference') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
    }

    showNewCategoryInput() {
        newCategoryGroup.style.display = 'block';
        newCategoryName.focus();
    }

    hideNewCategoryInput() {
        newCategoryGroup.style.display = 'none';
        newCategoryName.value = '';
    }

    // ===== Utility Functions =====
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCategoryColor(category) {
        const index = this.categories.indexOf(category);
        return CHART_COLORS[index % CHART_COLORS.length];
    }

    getTextColor() {
        return document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
    }
}

// ===== Initialize App =====
const app = new ExpenseTracker();

// Add slide-in animation for success messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
