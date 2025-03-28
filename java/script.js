document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".steps");
  const stickyHeight = window.innerHeight * 9;
  const cards = document.querySelectorAll(".card");
  const countContainer = document.querySelector(".count-container");
  const totalCards = cards.length;

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `+=${stickyHeight}px`,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      positionCards(self.progress);
    },
  });

  const getRadius = () => {
    return window.innerWidth < 1000
      ? window.innerWidth * 7.5
      : window.innerWidth * 2.5;
  };

  const arcAngle = Math.PI * 0.5;
  const startAngle = Math.PI / 3 - arcAngle / 3;

  function positionCards(progress = 0) {
    const radius = getRadius();
    const totalTravel = 1 + totalCards / 7.5;
    const adjustedProgress = (progress * totalTravel - 1) * 0.75;

    cards.forEach((card, i) => {
      const normalizedProgress = (totalCards - 1 - i) / totalCards;
      const cardProgress = normalizedProgress + adjustedProgress;
      const angle = startAngle + arcAngle * cardProgress;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

      gsap.set(card, {
        x: x,
        y: -y + radius,
        rotation: -rotation,
        transformOrigin: "center center",
      });
    });
  }

  positionCards(0);

  let currentCardIndex = 0;

  const options = {
    root: null,
    rootMargin: "0% 0%",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        lastScrollY = window.scrollY;

        let cardIndex = Array.from(cards).indexOf(entry.target);

        currentCardIndex = cardIndex;
        console.log(currentCardIndex);

        const targetY = 150 - currentCardIndex * 150;
        gsap.to(countContainer, {
          y: targetY,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  }, options);

  cards.forEach((card) => {
    observer.observe(card);
  });

  window.addEventListener("resize", () => positionCards(0));
});

document.addEventListener("DOMContentLoaded", function () {
  const dialogueContent = document.getElementById("dialogueContent");
  const options = document.querySelectorAll(".option");
  const option = document.querySelector(".option");

  options.forEach((option) => {
    option.addEventListener("click", function () {
      const response = this.getAttribute("data-response");
      dialogueContent.textContent = response;

      const action = this.getAttribute("data-action");
      if (action === "scroll") {
        setTimeout(() => {
          const stepsSection = document.querySelector(".steps");
          stepsSection.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const option = document.querySelector(".option");

  option.addEventListener("click", function () {
    if (this.textContent.trim() === "Who are you?") {
      this.classList.add("fade-out");

      setTimeout(() => {
        this.textContent = "so What is a game designer?";
        this.dataset.response =
          "A game designer plays a central role in the game development process. These individuals are responsible for shaping the overall concept, gameplay mechanics, and user experience of a video game.";

        void this.offsetWidth;

        this.classList.remove("fade-out");
        this.classList.add("fade-in");
      }, 400);
    }
  });
});
