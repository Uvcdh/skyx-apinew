<script>
// Loading screen
window.addEventListener('load', function() {
setTimeout(function() {
document.getElementById('loadingScreen').style.opacity = '0';
setTimeout(function() {
document.getElementById('loadingScreen').style.display = 'none';
}, 300);
}, 1000);
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', function() {
document.body.classList.toggle('dark-mode', this.checked);
localStorage.setItem('darkMode', this.checked);
});

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
document.body.classList.add('dark-mode');
themeToggle.checked = true;
}

// Side navigation toggle
const navCollapseBtn = document.querySelector('.nav-collapse-btn');
const sideNav = document.querySelector('.side-nav');
const mainWrapper = document.querySelector('.main-wrapper');

navCollapseBtn.addEventListener('click', function() {
sideNav.classList.toggle('collapsed');
mainWrapper.classList.toggle('collapsed');
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.getElementById('navOverlay');

function toggleMobileMenu() {
sideNav.classList.toggle('show');
navOverlay.classList.toggle('show');
document.body.classList.toggle('no-scroll', sideNav.classList.contains('show'));
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on overlay
navOverlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.side-nav-link');
navLinks.forEach(link => {
link.addEventListener('click', function(e) {
if (window.innerWidth < 768) {
toggleMobileMenu();
}

// Update active state
document.querySelectorAll('.side-nav-link').forEach(navLink => {
navLink.classList.remove('active');
});
this.classList.add('active');

// Scroll to section
const targetId = this.getAttribute('href');
if (targetId && targetId !== '#') {
const targetElement = document.querySelector(targetId);
if (targetElement) {
window.scrollTo({
top: targetElement.offsetTop - 20,
behavior: 'smooth'
});
}
}
});
});

// Clear search input
const clearSearch = document.getElementById('clearSearch');
const searchInput = document.getElementById('searchInput');

clearSearch.addEventListener('click', function() {
searchInput.value = '';
searchInput.focus();
this.style.display = 'none';
filterAPIs('');
});

// Show/hide clear button based on input
searchInput.addEventListener('input', function() {
clearSearch.style.display = this.value ? 'block' : 'none';
filterAPIs(this.value);
});

// Filter API cards based on search input
function filterAPIs(searchTerm) {
const apiCards = document.querySelectorAll('.api-card');
const searchLower = searchTerm.toLowerCase();

apiCards.forEach(card => {
const title = card.querySelector('.api-card-title').textContent.toLowerCase();
const description = card.querySelector('.api-card-description').textContent.toLowerCase();
const method = card.querySelector('.api-card-method').textContent.toLowerCase();

if (title.includes(searchLower) || 
description.includes(searchLower) || 
method.includes(searchLower)) {
card.style.display = 'block';
} else {
card.style.display = 'none';
}
});
}

// Try it out button click handler
document.querySelectorAll('.try-it-out').forEach(button => {
button.addEventListener('click', function() {
const modal = new bootstrap.Modal(document.getElementById('apiResponseModal'));

// Set modal content based on button data attributes
document.getElementById('apiResponseModalLabel').textContent = this.dataset.title;
document.getElementById('apiResponseModalDesc').textContent = this.dataset.description;
document.getElementById('apiEndpoint').textContent = this.dataset.endpoint;

// Show the modal
modal.show();
});
});

// Copy buttons
document.getElementById('copyEndpoint').addEventListener('click', function() {
const text = document.getElementById('apiEndpoint').textContent;
navigator.clipboard.writeText(text.trim());
showToast('Endpoint copied to clipboard!');
});

document.getElementById('copyResponse').addEventListener('click', function() {
const text = document.getElementById('apiResponseContent').textContent;
navigator.clipboard.writeText(text.trim());
showToast('Response copied to clipboard!');
});

// Submit button handler
document.getElementById('submitQueryBtn').addEventListener('click', function() {
const loading = document.getElementById('apiResponseLoading');
const responseContainer = document.getElementById('responseContainer');
const responseContent = document.getElementById('apiResponseContent');

loading.classList.remove('d-none');

// Simulate API call
setTimeout(function() {
loading.classList.add('d-none');
responseContainer.classList.remove('d-none');
responseContent.classList.remove('d-none');
}, 1500);
});

// Show toast notification
function showToast(message) {
const toastEl = document.getElementById('notificationToast');
const toastBody = toastEl.querySelector('.toast-body');
const toast = new bootstrap.Toast(toastEl);

toastBody.textContent = message;
toast.show();
}

// Show notification toast on page load
window.addEventListener('load', function() {
setTimeout(function() {
showToast('Welcome to our API documentation!');
}, 1500);
});

// Visitor count
fetch("https://visitor.api.akuari.my.id/umum/view/tambah-ip?id=https://berak.vercel.app/")
.then(res => res.json())
.then(data => {
document.getElementById('visitorCount').innerText = data.visitor.total || '1,000+';
})
.catch(err => {
console.error("Failed to fetch visitor data:", err);
document.getElementById('visitorCount').innerText = '1,000+';
});