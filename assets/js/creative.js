/* Creative Interactions */

(function($) {

    // Typing Effect
    const texts = ["Pabasara", "a Developer", "a Researcher", "a Creator"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    
    // Check if the typing element exists
    if (document.querySelector('.typing-text')) {
        (function type() {
            if (count === texts.length) {
                count = 0;
            }
            currentText = texts[count];
            letter = currentText.slice(0, ++index);
    
            document.querySelector('.typing-text').textContent = letter;
    
            if (letter.length === currentText.length) {
                count++;
                index = 0;
                setTimeout(type, 2000); // Wait before deleting/next word
            } else {
                setTimeout(type, 150);
            }
        })();
    }

    // Scroll Reveal for Cards
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('article, .post').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

})(jQuery);
