/* ================================================================
   script.js - Versión Final (FAQ Acordeón + Galería Pro)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initNavigation();
    initDarkMode();
    initModals(); 
    initGallerySystem(); 
    initFAQSystem(); // Nueva función para las preguntas
});

/* ================== 1. Menú Lateral ================== */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtnGlobal = document.getElementById('toggle-sidebar-global');
    const toggleBtnMobile = document.getElementById('toggle-sidebar-mobile');
    
    const toggleSidebar = () => {
        sidebar.classList.toggle('collapsed');
        if (toggleBtnGlobal) {
            const icon = toggleBtnGlobal.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-arrow-right');
            } else {
                icon.classList.remove('fa-arrow-right');
                icon.classList.add('fa-bars');
            }
        }
    };

    if (toggleBtnGlobal) toggleBtnGlobal.addEventListener('click', toggleSidebar);
    if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', toggleSidebar);
}

/* ================== 2. Navegación SPA ================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-view');
            if (!targetId) return; 
            
            e.preventDefault();
            views.forEach(view => view.classList.remove('active'));
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.add('active');
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ================== 3. Modo Oscuro ================== */
function initDarkMode() {
    const btnDarkMode = document.getElementById('btn-dark-mode');
    const iconDarkMode = document.getElementById('icon-dark-mode');
    const htmlElement = document.documentElement;

    // Cargar preferencia
    if (localStorage.getItem('theme') === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        if(iconDarkMode) iconDarkMode.classList.replace('fa-moon', 'fa-sun');
    }

    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', (e) => {
            e.preventDefault();
            htmlElement.classList.toggle('dark');
            
            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                if(iconDarkMode) iconDarkMode.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                if(iconDarkMode) iconDarkMode.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
}

/* ================== 4. SISTEMA DE GALERÍA ================== */
function initGallerySystem() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridContainer = document.getElementById('products-grid');
    let allCards = Array.from(document.querySelectorAll('.gallery-item-card'));
    
    // Estado de la galería
    let visibleCards = [...allCards]; 
    let currentIndex = 0;

    // Elementos del Modal
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const modalTitle = document.getElementById('lightbox-title');
    const modalDesc = document.getElementById('lightbox-desc');
    const modalCat = document.getElementById('lightbox-category');
    const modalWaBtn = document.getElementById('lightbox-whatsapp-btn');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // --- A. Lógica de Filtros ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-lime-500', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
                if(document.documentElement.classList.contains('dark')) {
                     b.classList.replace('bg-gray-200', 'bg-gray-700');
                     b.classList.replace('text-gray-700', 'text-gray-200');
                }
            });
            btn.classList.remove('bg-gray-200', 'text-gray-700', 'bg-gray-700', 'text-gray-200');
            btn.classList.add('bg-lime-500', 'text-white');

            const filterValue = btn.getAttribute('data-filter');
            visibleCards = [];

            if (filterValue === 'all') {
                visibleCards = [...allCards];
                allCards.forEach(card => gridContainer.appendChild(card));
            } else {
                const matches = [];
                const others = [];

                allCards.forEach(card => {
                    if (card.getAttribute('data-category') === filterValue) {
                        matches.push(card);
                    } else {
                        others.push(card);
                    }
                });

                matches.forEach(card => {
                    gridContainer.appendChild(card);
                    card.animate([{ transform: 'scale(0.95)', opacity: 0.7 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300 });
                });
                others.forEach(card => gridContainer.appendChild(card));
                visibleCards = matches;
            }
        });
    });

    // --- B. Función Actualizar Modal ---
    const updateModalContent = (index) => {
        if (index < 0 || index >= visibleCards.length) return;
        
        const card = visibleCards[index];
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const category = card.getAttribute('data-category');
        const imgEl = card.querySelector('img');
        
        modalImg.style.opacity = '0';
        
        setTimeout(() => {
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalImg.src = imgEl.src;
            modalCat.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            const phoneNumber = "573013811896"; 
            const message = `Hola, vi el "${title}" en tu web y me interesa.`;
            modalWaBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            modalImg.style.opacity = '1';
        }, 200);
    };

    // --- C. Evento Abrir Modal ---
    gridContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-item-card');
        if (card) {
            let index = visibleCards.indexOf(card);
            if (index === -1) {
                visibleCards = [...allCards]; 
                index = visibleCards.indexOf(card);
            }
            currentIndex = index;
            modalImg.classList.remove('lightbox-fullscreen');
            modalImg.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
            updateModalContent(currentIndex);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    });

    // --- D. Lógica de "Modo Cine" ---
    modalImg.addEventListener('click', (e) => {
        e.stopPropagation(); 
        modalImg.classList.toggle('lightbox-fullscreen');
        if (modalImg.classList.contains('lightbox-fullscreen')) {
            modalImg.classList.replace('cursor-zoom-in', 'cursor-zoom-out');
            showToast("Modo Pantalla Completa");
        } else {
            modalImg.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
        }
    });

    // --- E. Controles Slide ---
    const showNext = () => {
        currentIndex = (currentIndex + 1) % visibleCards.length;
        updateModalContent(currentIndex);
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
        updateModalContent(currentIndex);
    };

    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') {
            if (modalImg.classList.contains('lightbox-fullscreen')) {
                modalImg.classList.remove('lightbox-fullscreen');
                modalImg.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
            } else {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modalImg.classList.remove('lightbox-fullscreen');
            modalImg.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
        });
    }
}

/* ================== 5. SISTEMA FAQ (ACORDEÓN) ================== */
function initFAQSystem() {
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isClosed = content.classList.contains('hidden');

            // 1. CERRAR todos los demás
            document.querySelectorAll('.faq-content').forEach(el => {
                if (!el.classList.contains('hidden') && el !== content) {
                    el.classList.add('hidden');
                    // Resetear icono del hermano
                    const siblingBtn = el.previousElementSibling;
                    const siblingIcon = siblingBtn.querySelector('i');
                    if(siblingIcon) siblingIcon.classList.remove('faq-icon-rotate');
                }
            });

            // 2. TOGGLE del actual
            if (isClosed) {
                // Abrir
                content.classList.remove('hidden');
                icon.classList.add('faq-icon-rotate');
            } else {
                // Cerrar
                content.classList.add('hidden');
                icon.classList.remove('faq-icon-rotate');
            }
        });
    });
}

/* ================== 6. Modales Genéricos ================== */
function initModals() {
    const btnReportar = document.getElementById('btn-reportar-fallo');
    const modalReportar = document.getElementById('modal-reportar-fallo');
    if (btnReportar && modalReportar) {
        btnReportar.addEventListener('click', (e) => {
            e.preventDefault();
            modalReportar.classList.remove('hidden');
            modalReportar.classList.add('flex');
        });
    }

    const btnVivirApp = document.getElementById('btn-vivirapp-modal');
    const modalVivirApp = document.getElementById('modal-vivirapp');
    if (btnVivirApp && modalVivirApp) {
        btnVivirApp.addEventListener('click', (e) => {
            e.preventDefault();
            const iframe = document.getElementById('iframe-vivirapp');
            if (iframe && iframe.src === 'about:blank') iframe.src = 'vivirapp.html';
            modalVivirApp.classList.remove('hidden');
            modalVivirApp.classList.add('flex');
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }
        }
        if (e.target.classList.contains('modal')) {
            if(e.target.id === 'lightbox-modal') {
                const img = document.getElementById('lightbox-image');
                if(img) {
                    img.classList.remove('lightbox-fullscreen');
                    img.classList.replace('cursor-zoom-out', 'cursor-zoom-in');
                }
            }
            e.target.classList.remove('flex');
            e.target.classList.add('hidden');
        }
    });

    const formReporte = document.getElementById('form-reportar-fallo');
    if(formReporte) {
        formReporte.addEventListener('submit', (e) => {
            e.preventDefault();
            const m = document.getElementById('modal-reportar-fallo');
            if(m) { m.classList.add('hidden'); m.classList.remove('flex'); }
            showToast("Reporte enviado. ¡Gracias!");
            formReporte.reset();
        });
    }
}

/* ================== Utilidad Toast ================== */
function showToast(message) {
    const toast = document.getElementById('toast-notificacion');
    const msgEl = document.getElementById('toast-mensaje');
    if (!toast || !msgEl) return;
    
    msgEl.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3000);
}