class EnvironmentScrollAnimation extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return;

    this.dataset.initialized = "true";

    this.innerHTML = `
      <style>
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Poppins:wght@300;400;500&display=swap");

        :host {
          display: block;
          width: 100%;
          height: 300vh;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .scroll-section {
          position: relative;
          height: 300vh;
          font-family: "Poppins", Arial, sans-serif;
          background: #16261d;
          color: #f4f1ea;
        }

        .sticky-screen {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #16261d;
        }

        .background {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          will-change: opacity;
        }

        .background.color-bg {
          background: #16261d;
          opacity: 1;
        }

        .background img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .background.image-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(10, 15, 12, 0.18) 0%,
            rgba(10, 15, 12, 0.58) 55%,
            rgba(10, 15, 12, 0.78) 100%
          );
        }

        .content {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 8vw;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }

        .content.center-content {
          justify-content: center;
          text-align: center;
          opacity: 1;
        }

        .content-inner {
          width: min(540px, 100%);
          will-change: transform;
        }

        .center-content .content-inner {
          max-width: 650px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 18px;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a26a;
        }

        h2 {
          margin-bottom: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(34px, 4vw, 54px);
          font-weight: 400;
          line-height: 1.15;
          color: #f4f1ea;
        }

        .center-content h2 {
          color: #c9a26a;
          font-style: italic;
        }

        p {
          max-width: 470px;
          margin-bottom: 14px;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(244, 241, 234, 0.78);
        }

        .learn-more {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          color: #c9a26a;
        }

        @media (max-width: 760px) {
          .content {
            justify-content: center;
            padding: 0 7vw;
          }

          .content-inner,
          p {
            max-width: 100%;
          }
        }
      </style>

      <section class="scroll-section">
        <div class="sticky-screen">
          <div class="background color-bg"></div>

          <div class="background image-bg">
            <img
              src="https://static.wixstatic.com/media/1e62b2_95afa9d3b4e74db9a7349f635fcf5f4a~mv2.jpg"
              alt="Private Cinema"
            />
          </div>

          <div class="background image-bg">
            <img
              src="https://static.wixstatic.com/media/1e62b2_6f9204459dba407693673a406f87aff4~mv2.jpg"
              alt="Master Suite"
            />
          </div>

          <div class="content center-content">
            <div class="content-inner">
              <span class="eyebrow">Environments</span>
              <h2>Homes that respond<br />to how you live</h2>
            </div>
          </div>

          <div class="content">
            <div class="content-inner">
              <h2>Private Cinema</h2>

              <p>
                Designed around the way you entertain, with integrated audio,
                intelligent lighting, climate control and intuitive control
                working together as one.
              </p>

              <p>
                Every interaction feels effortless, allowing the technology to
                disappear into the background.
              </p>

              <a class="learn-more" href="#">
                Learn More <span>→</span>
              </a>
            </div>
          </div>

          <div class="content">
            <div class="content-inner">
              <h2>Master Suite</h2>

              <p>
                Lighting, climate, shading and home integration work quietly
                together to create a bedroom environment that adapts from
                morning through to night.
              </p>

              <p>
                Comfort, atmosphere and control remain effortless and discreet.
              </p>

              <a class="learn-more" href="#">
                Learn More <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;

    this.setupAnimation();
  }

  setupAnimation() {
    const section = this.querySelector(".scroll-section");
    const backgrounds = [...this.querySelectorAll(".background")];
    const contents = [...this.querySelectorAll(".content")];

    let ticking = false;

    const clamp = (value, min = 0, max = 1) => {
      return Math.min(Math.max(value, min), max);
    };

    const ease = (value) => {
      value = clamp(value);
      return value * value * (3 - 2 * value);
    };

    const rangeProgress = (value, start, end) => {
      return clamp((value - start) / (end - start));
    };

    function getContentState(
      timeline,
      enterStart,
      enterEnd,
      exitStart,
      exitEnd,
      isLast = false
    ) {
      let opacity = 0;
      let translateY = 55;

      if (enterStart <= 0 && timeline <= 0) {
        return {
          opacity: 1,
          translateY: 0
        };
      }

      if (timeline >= enterStart && timeline < enterEnd) {
        const enterProgress = ease(
          rangeProgress(timeline, enterStart, enterEnd)
        );

        opacity = enterProgress;
        translateY = (1 - enterProgress) * 55;
      } else if (timeline >= enterEnd && timeline < exitStart) {
        opacity = 1;
        translateY = 0;
      } else if (!isLast && timeline >= exitStart && timeline < exitEnd) {
        const exitProgress = ease(
          rangeProgress(timeline, exitStart, exitEnd)
        );

        opacity = 1 - exitProgress;
        translateY = -exitProgress * 65;
      } else if (isLast && timeline >= exitStart) {
        opacity = 1;
        translateY = 0;
      }

      return {
        opacity,
        translateY
      };
    }

    const timings = [
      {
        enterStart: -1,
        enterEnd: 0,
        exitStart: 0.58,
        exitEnd: 0.82,
        isLast: false
      },
      {
        enterStart: 1.18,
        enterEnd: 1.35,
        exitStart: 1.58,
        exitEnd: 1.82,
        isLast: false
      },
      {
        enterStart: 2.18,
        enterEnd: 2.35,
        exitStart: 2.6,
        exitEnd: 3,
        isLast: true
      }
    ];

    const updateAnimation = () => {
      ticking = false;

      const rect = section.getBoundingClientRect();

      const scrollableHeight =
        section.offsetHeight - window.innerHeight;

      const progress = clamp(
        (-rect.top) / scrollableHeight
      );

      const timeline = progress * 3;

      backgrounds[0].style.opacity =
        1 - ease(rangeProgress(timeline, 0.85, 1.15));

      backgrounds[1].style.opacity =
        ease(rangeProgress(timeline, 0.85, 1.15)) *
        (1 - ease(rangeProgress(timeline, 1.85, 2.15)));

      backgrounds[2].style.opacity =
        ease(rangeProgress(timeline, 1.85, 2.15));

      contents.forEach((content, index) => {
        const timing = timings[index];

        const state = getContentState(
          timeline,
          timing.enterStart,
          timing.enterEnd,
          timing.exitStart,
          timing.exitEnd,
          timing.isLast
        );

        content.style.opacity = state.opacity;

        content.style.pointerEvents =
          state.opacity > 0.6 ? "auto" : "none";

        content.querySelector(".content-inner").style.transform =
          `translate3d(0, ${state.translateY}px, 0)`;
      });
    };

    this.handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimation);
        ticking = true;
      }
    };

    window.addEventListener("scroll", this.handleScroll, {
      passive: true
    });

    window.addEventListener("resize", this.handleScroll);

    updateAnimation();
  }

  disconnectedCallback() {
    if (this.handleScroll) {
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("resize", this.handleScroll);
    }
  }
}

if (!customElements.get("environment-scroll-animation")) {
  customElements.define(
    "environment-scroll-animation",
    EnvironmentScrollAnimation
  );
}