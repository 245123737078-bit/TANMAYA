const video = document.getElementById("cameraPreview");
const captureBtn = document.getElementById("captureBtn");
const capturedImageArea = document.getElementById("capturedImageArea");
const capturedImage = document.getElementById("capturedImage");

// Request Camera Access
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        alert("Camera access denied or unavailable.");
    }
}

startCamera();

// Capture the photo
captureBtn.onclick = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    capturedImage.src = canvas.toDataURL("image/png");
    capturedImageArea.style.display = "block";
};
