const modelURL = "https://mikeybrg.github.io/Hero.ai/model.json";

let model;
let video;
let isLoaded = false;

// Load the model
async function loadModel() {
    const loadingText = document.getElementById("loading");
    loadingText.innerText = "Loading Model...";

    try {
        model = await tmImage.load(modelURL, {
            crossOrigin: "anonymous"
        });

        isLoaded = true;
        loadingText.innerText = "Model Loaded!";
        startCamera();
    } catch (error) {
        console.error("MODEL LOAD ERROR:", error);
        loadingText.innerText = "Failed to load model.";
    }
}

// Start front camera
async function startCamera() {
    video = document.getElementById("video");

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
    });

    video.srcObject = stream;
    video.addEventListener("loadeddata", () => {
        predictLoop();
    });
}

// Prediction loop
async function predictLoop() {
    if (!isLoaded) return;

    const prediction = await model.predict(video);
    let best = prediction[0];

    for (let p of prediction) {
        if (p.probability > best.probability) best = p;
    }

    document.getElementById("result").innerText =
        best.className === "Make" ? "✅ MAKE!" : "❌ MISS";

    requestAnimationFrame(predictLoop);
}

loadModel();
