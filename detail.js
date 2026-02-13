let forumItems = [];

const detailContent = document.getElementById('detailContent');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');

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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        forumItems = data.forumItems;
        loadItemDetail();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Gagal memuat data. Silakan periksa file data.json');
    }
}

function loadItemDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id'));
    
    if (!itemId || isNaN(itemId)) {
        showError('ID script tidak ditemukan atau tidak valid');
        return;
    }
    
    const item = forumItems.find(item => item.id === itemId);
    
    if (!item) {
        showError('Script tidak ditemukan');
        return;
    }
    
    renderItemDetail(item);
}

function renderItemDetail(item) {
    const categoriesHTML = item.categories && item.categories.length > 0 ? 
        `<div class="item-categories">${item.categories.map(cat => {
            const categoryColor = categoryColors[cat] || '#4285F4';
            const categoryName = categoryNames[cat] || formatCategoryName(cat);
            return `<div class="item-category" style="background-color: ${categoryColor}20; color: ${categoryColor}">${categoryName}</div>`;
        }).join('')}</div>` : '';
    
    const previewImagesHTML = item.images && item.images.length > 0 ? 
        `<div class="preview-section">
            <h3><i class="fas fa-images"></i> Preview Images</h3>
            <div class="image-gallery">
                ${item.images.map((image, index) => `
                    <div class="gallery-image-container" onclick="openImageModal('${image}', ${index}, ${item.images.length})">
                        <img src="${image}" alt="Preview ${index + 1}" class="gallery-image" onerror="this.src='images/default.jpg'">
                    </div>
                `).join('')}
            </div>
        </div>` : '';
    
    const tiktokHTML = item.tiktokUrl ? 
        `<div class="tiktok-section">
            <h3><i class="fab fa-tiktok"></i> Video Tutorial & Demo</h3>
            <div class="tiktok-grid">
                ${item.previewLink ? `
                <div class="tiktok-card">
                    <div class="tiktok-icon">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <h4>Preview Demo</h4>
                    <p>Tonton demo penggunaan script ini</p>
                    <a href="${item.previewLink}" target="_blank" class="tiktok-link">
                        <i class="fab fa-tiktok"></i> Tonton Demo
                    </a>
                </div>
                ` : ''}
                
                ${item.tutorialLink ? `
                <div class="tiktok-card">
                    <div class="tiktok-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h4>Tutorial Pemasangan</h4>
                    <p>Panduan cara download & install</p>
                    <a href="${item.tutorialLink}" target="_blank" class="tiktok-link">
                        <i class="fab fa-tiktok"></i> Lihat Tutorial
                    </a>
                </div>
                ` : ''}
            </div>
        </div>` : '';
    
    const downloadLinksHTML = item.downloadLinks && item.downloadLinks.length > 0 ? 
        `<div class="download-section">
            <h3><i class="fas fa-file-download"></i> Download Files</h3>
            <div class="download-links">
                ${item.downloadLinks.map(link => `
                    <a href="${link.url}" class="download-link" download>
                        <i class="fas ${getFileIcon(link.url)}"></i>
                        <div class="download-info">
                            <div class="download-name">${link.name}</div>
                            <div class="download-url">${link.size ? `Size: ${link.size} • ` : ''}${link.url}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>` : 
        `<div class="download-section">
            <h3><i class="fas fa-file-download"></i> Download Files</h3>
            <div class="no-downloads">
                <i class="fas fa-exclamation-circle"></i>
                <p>Tidak ada file yang tersedia untuk diunduh</p>
            </div>
        </div>`;
    
    const metadataItems = [];
    if (item.author) metadataItems.push(`<div class="metadata-item"><i class="fas fa-user"></i><strong>Developer:</strong> ${item.author}</div>`);
    if (item.version) metadataItems.push(`<div class="metadata-item"><i class="fas fa-tag"></i><strong>Version:</strong> ${item.version}</div>`);
    if (item.releaseDate) metadataItems.push(`<div class="metadata-item"><i class="fas fa-calendar"></i><strong>Released:</strong> ${formatDate(item.releaseDate)}</div>`);
    if (item.license) metadataItems.push(`<div class="metadata-item"><i class="fas fa-balance-scale"></i><strong>License:</strong> ${item.license}</div>`);
    if (item.fileSize) metadataItems.push(`<div class="metadata-item"><i class="fas fa-hdd"></i><strong>Total Size:</strong> ${item.fileSize}</div>`);
    if (item.requirements) metadataItems.push(`<div class="metadata-item"><i class="fas fa-cogs"></i><strong>Requirements:</strong> ${item.requirements}</div>`);
    
    const metadataHTML = metadataItems.length > 0 ? 
        `<div class="metadata-section">
            <h3><i class="fas fa-info-circle"></i> Informasi</h3>
            <div class="metadata-grid">
                ${metadataItems.join('')}
            </div>
        </div>` : '';
    
    detailContent.innerHTML = `
        <a href="index.html" class="back-button">
            <i class="fas fa-home"></i> Kembali ke Home
        </a>
        
        <div class="detail-content">
            <h1 class="detail-title">${item.title}</h1>
            
            ${categoriesHTML}
            
            <div class="detail-description">
                ${item.description}
            </div>
            
            <div class="detail-body">
                ${item.content}
            </div>
            
            ${previewImagesHTML}
            
            ${tiktokHTML}
            
            ${downloadLinksHTML}
            
            ${metadataHTML}
        </div>
    `;
    
    detailContent.classList.remove('loading');
}

function getFileIcon(url) {
    if (url.includes('.unitypackage')) return 'fa-cube';
    if (url.includes('.zip') || url.includes('.rar') || url.includes('.7z')) return 'fa-file-archive';
    if (url.includes('.pdf')) return 'fa-file-pdf';
    if (url.includes('.exe')) return 'fa-cogs';
    if (url.includes('.dll')) return 'fa-microchip';
    if (url.includes('.cs')) return 'fa-file-code';
    return 'fa-file-download';
}

function formatCategoryName(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function openImageModal(imageSrc, imageIndex, totalImages) {
    modalImage.src = imageSrc;
    modalCaption.textContent = `Preview ${imageIndex + 1} dari ${totalImages}`;
    imageModal.style.display = 'flex';
    
    document.addEventListener('keydown', function escapeHandler(event) {
        if (event.key === 'Escape') {
            imageModal.style.display = 'none';
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function showError(message) {
    detailContent.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="index.html" class="back-button">
                <i class="fas fa-home"></i> Kembali ke Home
            </a>
        </div>
    `;
    detailContent.classList.remove('loading');
}

closeModal.addEventListener('click', function() {
    imageModal.style.display = 'none';
});

imageModal.addEventListener('click', function(event) {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    const discordButton = document.querySelector('.discord-button');
    if (discordButton) {
        discordButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.open(this.href, '_blank');
        });
    }
});

window.openImageModal = openImageModal;