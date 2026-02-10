// ===============================
// Animation Timeline
// ===============================
const animationTimeline = () => {

  // Utility: split text into spans safely
  const splitTextIntoSpans = (element) => {
    if (!element) return;

    const text = element.textContent;
    element.innerHTML = text
      .split("")
      .map(char => {
        if (char === " ") return `<span>&nbsp;</span>`;
        return `<span>${char}</span>`;
      })
      .join("");
  };


  const textBox = document.getElementsByClassName("hbd-chatbox")[0];
  const wishHeading = document.getElementsByClassName("wish-hbd")[0];

  splitTextIntoSpans(textBox);
  splitTextIntoSpans(wishHeading);

  // Reusable animation presets
  const ideaEnter = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaExit = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  window.tl = new TimelineMax();


  tl.to(".container", 0.1, { visibility: "visible" })

    // Intro
    .from(".one", 0.7, { opacity: 0, y: 12 })
    .from(".two", 0.4, { opacity: 0, y: 12 })

    .to(".one", 0.7, { opacity: 0, y: 12 }, "+=2.5")
    .to(".two", 0.7, { opacity: 0, y: 12 }, "-=1")

    // Scene 2
    .from(".three", 0.7, { opacity: 0, y: 12 })
    .to(".three", 0.7, { opacity: 0, y: 12 }, "+=2")

    // Chat box
    .from(".four", 0.7, { scale: 0.25, opacity: 0 })
    .from(".fake-btn", 0.3, { scale: 0.4, opacity: 0 })

    .staggerTo(
      ".hbd-chatbox span",
      0.45,
      { visibility: "visible" },
      0.045
    )

    .to(".fake-btn", 0.15, {
      backgroundColor: "rgb(127, 206, 248)",
    })

    .to(".four", 0.6, {
      scale: 0.2,
      opacity: 0,
      y: -140,
    }, "+=3.0")

    // Thought sequence
    .from(".idea-1", 0.7, ideaEnter)
    .to(".idea-1", 0.7, ideaExit, "+=1.5")

    .from(".idea-2", 0.7, ideaEnter)
    .to(".idea-2", 0.7, ideaExit, "+=1.5")

    .from(".idea-3", 0.7, ideaEnter)
    .to(".idea-3 strong", 0.5, {
      scale: 1.15,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaExit, "+=1.5")

    .from(".idea-4", 0.7, ideaEnter)
    .to(".idea-4", 0.7, ideaExit, "+=1.5")

    // Emphasis moment
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -8,
      skewY: "-5deg",
      y: 50,
      opacity: 0,
    }, "+=0.5")

    .to(".idea-5 span", 0.6, {
      rotation: 90,
      x: 8,
    }, "+=0.4")

    .to(".idea-5", 0.7, {
      scale: 0.2,
      opacity: 0,
    }, "+=2")

    // Big letters
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: 15,
      ease: Expo.easeOut,
    }, 0.2)

    .staggerTo(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: -15,
      ease: Expo.easeOut,
    }, 0.2, "+=1")

    .to(".valentine-box", 0.6, {
      opacity: 1,
      pointerEvents: "auto"
    })
    .call(initValentineInteraction)

    .addPause("waitForYes")

    // Floating visuals (unchanged image refs)
    .staggerFromTo(
      ".baloons img",
      2.5,
      { opacity: 0.9, y: 1400 },
      { opacity: 1, y: -1000 },
      0.2
    )

    // Image reveal (Classy Polaroid Drop)
    .from(".six", 0.7, {
      opacity: 0,
      pointerEvents: "none"
    }, "-=2")
    .from(".girl-dp", 1, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      rotation: 5,
      ease: Power2.easeOut,
    }, "-=2")

    // Wish text (Elegant Reveal)
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: 20,
      ease: Power2.easeOut,
    }, 0.05)

    .from(".wish h5", 0.7, {
      opacity: 0,
      y: 20,
      ease: Power2.easeOut,
    }, "-=0.2")

    // SVG burst
    .staggerTo(".eight svg", 1.5, {
      visibility: "visible",
      opacity: 0,
      scale: 80,
      repeat: 3,
      repeatDelay: 1.4,
    }, 0.3)

    // Fade out the wish section
    .to(".six", 0.7, {
      opacity: 0,
      pointerEvents: "none"
    }, "+=1")

    .to(".nine", 0.1, { opacity: 1, pointerEvents: "auto" })
    .staggerFrom(".nine p", 1, ideaEnter, 1.2)
    .to(".valentine-box", 0.6, {
      opacity: 1,
      pointerEvents: "auto"
    })
    .call(initValentineInteraction);

  // Replay
  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => tl.restart());
  }
};

// ===============================
// Data Injection
// ===============================
// ===============================
// Data Injection
// ===============================
const fetchData = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const valentineCode = urlParams.get("valentineCode");
  const valentinePassword = localStorage.getItem("valentinePassword");

  console.log("FetchData config:", { valentineCode, hasPassword: !!valentinePassword });

  // DEBUG ALERT - Remove after fixing
  // alert(`Debug: Code=${valentineCode}, Pass=${!!valentinePassword}`);

  if (!valentineCode || !valentinePassword) {
    console.warn("No valentineCode or password found. Skipping API fetch.");
    return;
  }

  try {
    const res = await fetch("https://api.cohrenzai.com/ValidateValentineNumber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ valentineCode, valentinePassword }),
    });

    if (!res.ok) throw new Error("API response not ok: " + res.status);

    const data = await res.json();
    console.log("API Response Data:", data);

    // Handle direct or nested data structure
    const content = data.data || data.user || data;
    console.log("Resolved Content Object:", content);

    // Map API fields to DOM
    // sender -> #name
    if (content.receiver) {
      const nameEl = document.getElementById("name");
      console.log("Updating Name Element:", nameEl, "with", content.receiver);
      if (nameEl) nameEl.innerText = content.receiver;
    } else {
      console.warn("No receiver field in content");
    }

    // paragraph -> #wishText
    if (content.paragraph) {
      const wishEl = document.getElementById("wishText");
      console.log("Updating Wish Element:", wishEl, "with", content.paragraph);
      if (wishEl) wishEl.innerText = content.paragraph;
    } else {
      console.warn("No paragraph field in content (or null)");
    }

    // image_url -> #imagePath (src)
    if (content.image_url) {
      const imgEl = document.getElementById("imagePath");
      console.log("Updating Image Element:", imgEl, "with", content.image_url);
      if (imgEl) imgEl.setAttribute("src", content.image_url);
    } else {
      console.warn("No image_url field in content");
    }

  } catch (err) {
    console.error("Error fetching data from API:", err);
    // alert("Error fetching data: " + err.message);
  }
};

// ===============================
// Init (correct sequencing)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  fetchData().then(() => {
    animationTimeline();
  });
});

// ===============================
// Valentine Interaction Logic
// ===============================
const initValentineInteraction = () => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const responseText = document.getElementById("valentineResponse");

  if (!yesBtn || !noBtn) return;

  // --- "Yes" Button Logic ---
  yesBtn.addEventListener("click", () => {
    responseText.textContent = "Yay! You just made my day 💖";

    // Confetti Explosion
    if (typeof confetti === "function") {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }

    // Disable buttons
    yesBtn.style.pointerEvents = "none";
    noBtn.style.pointerEvents = "none";
    noBtn.style.display = "none";

    // Transition out
    TweenMax.delayedCall(3, () => {
      TweenMax.to(".valentine-box", 0.6, {
        opacity: 0,
        scale: 0.92,
        pointerEvents: "none",
        onComplete: () => {
          const box = document.querySelector(".valentine-box");
          if (box) box.style.display = "none";
          window.tl.play("waitForYes");
        }
      });
    });
  });

  // --- "No" Button Logic (Run Away + Pleading) ---
  const messages = [
    "Really?", "Think again!", "Pookie please?", "Are you sure?",
    "Last chance!", "Don't break my heart ;(", "Pretty please?"
  ];
  let messageIndex = 0;

  const moveNoButton = () => {
    // 1. Reparent to body if needed (to escape the container's transform)
    if (noBtn.parentNode !== document.body) {
      const rect = noBtn.getBoundingClientRect();

      // Temporarily set style to match current visual position
      noBtn.style.position = "absolute";
      noBtn.style.left = rect.left + "px";
      noBtn.style.top = rect.top + "px";

      document.body.appendChild(noBtn);
    }

    // 2. Change text
    noBtn.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    // 3. Move Logic (Relative Jumps)
    const currentLeft = parseFloat(noBtn.style.left) || noBtn.getBoundingClientRect().left;
    const currentTop = parseFloat(noBtn.style.top) || noBtn.getBoundingClientRect().top;

    // Move distance: between 50px and 200px
    const distance = 150;

    // Random direction
    const angle = Math.random() * Math.PI * 2;

    let newX = currentLeft + Math.cos(angle) * distance;
    let newY = currentTop + Math.sin(angle) * distance;

    // 4. Boundary Checks (Padding of 20px)
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    // Clamp values
    newX = Math.min(Math.max(padding, newX), maxX);
    newY = Math.min(Math.max(padding, newY), maxY);

    // Apply new position
    noBtn.style.position = "absolute"; // Ensure it stays absolute/fixed
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    noBtn.style.zIndex = "999999";
  };

  // Events to trigger movement
  noBtn.addEventListener("mouseover", moveNoButton);
  noBtn.addEventListener("click", moveNoButton);
};







/*// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, {
    visibility: "visible",
  })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10,
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10,
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10,
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0,
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0,
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible",
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)",
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150,
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
      },
      "+=0.5"
    )
    .to(
      ".idea-5 span",
      0.7,
      {
        rotation: 90,
        x: 8,
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0,
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut,
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut,
      },
      0.2,
      "+=1"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400,
      },
      {
        opacity: 1,
        y: -1000,
      },
      0.2
    )
    .from(
      ".girl-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45,
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0,
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5),
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150,
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut,
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg",
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90,
      },
      "+=1"
    );

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};

// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json")
    .then((data) => data.json())
    .then((data) => {
      Object.keys(data).map((customData) => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .getElementById(customData)
              .setAttribute("src", data[customData]);
          } else {
            document.getElementById(customData).innerText = data[customData];
          }
        }
      });
    });
};

// Run fetch and animation in sequence
const resolveFetch = () => {
  return new Promise((resolve, reject) => {
    fetchData();
    resolve("Fetch done!");
  });
};

resolveFetch().then(animationTimeline());
*/

// ===============================
// Cursor Heart Spawning
// ===============================
const spawnHeartAtCursor = (e) => {
  const heart = document.createElement("div");
  heart.className = "heart";

  // Position heart at exact cursor location
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";
  heart.style.bottom = "auto";

  // Use cursor-specific animation
  heart.style.animationName = "floatUpFromCursor";

  // Random animation duration between 2-3 seconds for variety
  const duration = (Math.random() * 1 + 2).toFixed(2);
  heart.style.animationDuration = duration + "s";

  // Random color variation for hearts
  const colors = ["#ff4d6d", "#ff6b9d", "#ff85c0", "#ffa3d2", "#ffc1e3"];
  heart.style.background = colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(heart);

  // Remove heart element after animation completes
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
};

// Track cursor movement and spawn hearts
document.addEventListener("mousemove", spawnHeartAtCursor);
