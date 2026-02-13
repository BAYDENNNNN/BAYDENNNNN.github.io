let forumItems = [];

const forumList = document.getElementById('forumList');
const totalItems = document.getElementById('totalItems');
const totalCategories = document.getElementById('totalCategories');
const totalDownloads = document.getElementById('totalDownloads');
const searchInput = document.getElementById('searchInput');
const categoryFiltersContainer = document.querySelector('.category-filters');

const categoryColors = {
    'monet': '#60A5FA',
    'moon': '#34D399',
    'android': '#7C3AED',
    'pc': '#FBBF24',
    'cleo': '#F87171'
};

const categoryNames = {
    'monet': 'Monetloader',
    'moon': 'Moonloader',
    'android': 'Android',
    'pc': 'PC',
    'cleo': 'Cleo'
};

async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        forumItems = data.forumItems;
        updateTotalItems();
        renderCategoryFilters();
        renderForumItems(forumItems);
    } catch (error) {
        console.error('Error loading data:', error);
        forumList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Gagal memuat data</h3>
                <p>Silakan periksa file data.json</p>
            </div>
        `;
    }
}

function renderCategoryFilters() {
    const allCategories = [];
    forumItems.forEach(item => {
        if (item.categories && Array.isArray(item.categories)) {
            allCategories.push(...item.categories);
        }
    });
    
    const uniqueCategories = ['all', ...new Set(allCategories)];
    
    categoryFiltersContainer.innerHTML = uniqueCategories.map(category => {
        const categoryName = category === 'all' ? 'Semua Script' : 
                           categoryNames[category] || formatCategoryName(category);
        
        return `
            <button class="category-filter ${category === 'all' ? 'active' : ''}" 
                    data-category="${category}">
                ${categoryName}
            </button>
        `;
    }).join('');
    
    const newCategoryFilters = categoryFiltersContainer.querySelectorAll('.category-filter');
    
    newCategoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            newCategoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
}

function formatCategoryName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.getElementById('imageModal').style.display === 'flex') {
            document.getElementById('imageModal').style.display = 'none';
        }
    });
}

function renderForumItems(items) {
    if (items.length === 0) {
        forumList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Tidak ada script yang ditemukan</h3>
                <p>Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori lain</p>
            </div>
        `;
        return;
    }
    
    forumList.innerHTML = '';
    
    items.forEach(item => {
        const forumItem = document.createElement('a');
        forumItem.className = 'forum-item';
        forumItem.href = `detail.html?id=${item.id}`;
        
        const thumbnail = item.images && item.images.length > 0 ? item.images[0] : 'images/default.jpg';
        
        const categoriesHTML = item.categories && item.categories.length > 0 ? 
            `<div class="item-categories">${item.categories.map(cat => {
                const categoryColor = categoryColors[cat] || '#4285F4';
                const categoryName = categoryNames[cat] || formatCategoryName(cat);
                return `<div class="item-category" style="background-color: ${categoryColor}20; color: ${categoryColor}">${categoryName}</div>`;
            }).join('')}</div>` : '';
        
        const downloadCount = item.downloadLinks ? item.downloadLinks.length : 0;
        const fileSize = item.fileSize ? item.fileSize : '';
        const version = item.version ? item.version : '';
        const tiktokBadge = item.tiktokUrl ? '<span><i class="fab fa-tiktok"></i> Video Tutorial</span>' : '';
        
        forumItem.innerHTML = `
            <div class="item-header">
                ${categoriesHTML}
                <h3 class="item-title">${item.title}</h3>
            </div>
            <div class="item-description">
                <p>${item.description}</p>
            </div>
            <div class="image-container">
                <img src="${thumbnail}" alt="${item.title}" class="item-image" onerror="this.src='images/default.jpg'">
            </div>
            <div class="item-footer">
                <div class="item-meta">
                    <span><i class="fas fa-code"></i> ${version || 'v1.0'}</span>
                    <span><i class="fas fa-download"></i> ${downloadCount} file</span>
                    ${fileSize ? `<span><i class="fas fa-hdd"></i> ${fileSize}</span>` : ''}
                    ${item.releaseDate ? `<span><i class="fas fa-calendar"></i> ${formatDate(item.releaseDate)}</span>` : ''}
                    ${tiktokBadge}
                </div>
            </div>
        `;
        
        forumList.appendChild(forumItem);
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategoryElement = document.querySelector('.category-filter.active');
    const activeCategory = activeCategoryElement ? activeCategoryElement.getAttribute('data-category') : 'all';
    
    let filteredItems = forumItems;
    
    if (activeCategory !== 'all') {
        filteredItems = filteredItems.filter(item => {
            return item.categories && item.categories.includes(activeCategory);
        });
    }
    
    if (searchTerm.trim() !== '') {
        filteredItems = filteredItems.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const descMatch = item.description.toLowerCase().includes(searchTerm);
            const tagsMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const authorMatch = item.author && item.author.toLowerCase().includes(searchTerm);
            
            return titleMatch || descMatch || tagsMatch || authorMatch;
        });
    }
    
    renderForumItems(filteredItems);
}

function filterByCategory(category) {
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredItems = forumItems;
    
    if (category !== 'all') {
        filteredItems = filteredItems.filter(item => {
            return item.categories && item.categories.includes(category);
        });
    }
    
    if (searchTerm.trim() !== '') {
        filteredItems = filteredItems.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const descMatch = item.description.toLowerCase().includes(searchTerm);
            const tagsMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            return titleMatch || descMatch || tagsMatch;
        });
    }
    
    renderForumItems(filteredItems);
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function updateTotalItems() {
    totalItems.textContent = forumItems.length;
    
    const allCategories = [];
    let totalDownloadCount = 0;
    
    forumItems.forEach(item => {
        if (item.categories && Array.isArray(item.categories)) {
            allCategories.push(...item.categories);
        }
        if (item.downloadLinks && Array.isArray(item.downloadLinks)) {
            totalDownloadCount += item.downloadLinks.length;
        }
    });
    
    const uniqueCategories = [...new Set(allCategories)];
    totalCategories.textContent = uniqueCategories.length;
    totalDownloads.textContent = totalDownloadCount;
}