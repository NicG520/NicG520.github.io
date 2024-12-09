document.addEventListener('DOMContentLoaded', () => {
    // Configuração de sliders com Hammer.js
    const container = document.querySelector('.container');
    container.querySelectorAll('.slider').forEach((slider) => {
        const hammer = new Hammer(slider);
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        hammer.on('panmove', (e) => {
            slider.style.transform = `translate(${e.deltaX}px, ${e.deltaY}px) rotate(0deg)`;
        });

        hammer.on('panend', (e) => {
            const threshold = 150;
            if (Math.abs(e.deltaX) > threshold) {
                slider.style.transition = 'transform 0.3s ease';
                const direction = e.deltaX > 0 ? 1 : -1;
                slider.style.transform = `translate(${direction * 200}vw, 0) rotate(0deg)`;

                setTimeout(() => {
                    slider.style.transition = '';
                    if (direction > 0) container.appendChild(slider);
                    else container.insertBefore(slider, container.firstChild);

                    resetPositions();
                }, 300);
            } else {
                slider.style.transition = 'transform 0.3s ease';
                slider.style.transform = 'translate(0, 0) rotate(0deg)';
            }
        });
    });

    function resetPositions() {
        const sliders = Array.from(container.querySelectorAll('.slider'));
        const visibleLimit = 5; // Limite de cartas visíveis
        sliders.forEach((slider, index) => {
            slider.style.transition = 'transform 0.6s ease';

            if (index < visibleLimit) {
                const offset = index - Math.floor(sliders.length / 2);

                // Carta começando da esquerda
                slider.style.transform = `rotate(${offset * 0.6}deg) translateX(-100vw)`;

                // Agora animar para seu ponto central
                setTimeout(() => {
                    slider.style.transform = `rotate(${offset * 0.6}deg) translateX(0)`;
                }, 0);

                slider.style.zIndex = sliders.length - index;
            } else {
                // Mover as demais cartas para fora da tela
                slider.style.transform = 'translateX(-100vw) rotate(0deg)';
                slider.style.zIndex = 0;
            }
        });
    }

    resetPositions();

    // Configuração de rolagem entre páginas
    const pages = [document.querySelector('.full'), ...document.querySelectorAll('.content')];
    let currentPage = 0;

    const scrollNext = document.getElementById('scrollNext');
    const scrollBack = document.getElementById('scrollBack');

    function scrollToNextPage() {
        if (currentPage < pages.length - 1) currentPage++;
        else currentPage = 0;

        pages[currentPage].scrollIntoView({ behavior: 'smooth' });
    }

    function scrollToPreviousPage() {
        if (currentPage > 0) currentPage--;
        else currentPage = pages.length - 1;

        pages[currentPage].scrollIntoView({ behavior: 'smooth' });
    }

    window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    scrollNext.addEventListener('click', scrollToNextPage);
    scrollBack.addEventListener('click', scrollToPreviousPage);
});
