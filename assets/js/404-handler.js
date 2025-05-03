// Danh sách các trang hợp lệ
const validPages = [
    '/',
    '/index.html',
    '/resume.html',
    '/project.html',
    '/contact.html',
    '/404.html'
];

// Hàm kiểm tra URL có hợp lệ không
function isValidUrl(url) {
    // Nếu là URL tuyệt đối, chỉ xử lý các URL trong cùng domain
    if (url.startsWith('http')) {
        return false;
    }
    
    // Xử lý URL tương đối
    const path = url.split('?')[0]; // Bỏ query string
    return validPages.includes(path);
}

// Xử lý khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Nếu đang ở trang 404
    if (window.location.pathname === '/404.html') {
        const originalUrl = sessionStorage.getItem('originalUrl');
        if (originalUrl) {
            console.log('Original URL:', originalUrl);
            // Nếu URL gốc hợp lệ, chuyển hướng về
            if (isValidUrl(originalUrl)) {
                window.location.href = originalUrl;
                return;
            }
            sessionStorage.removeItem('originalUrl');
        }
    }

    // Xử lý tất cả các link trong trang
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Bỏ qua các link đặc biệt
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            // Kiểm tra URL có hợp lệ không
            if (!isValidUrl(href)) {
                e.preventDefault();
                sessionStorage.setItem('originalUrl', href);
                window.location.href = '/404.html';
            }
        });
    }
}); 