const camera = document.querySelector('#camera');

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateRotation() {
  let rotation = camera.getAttribute('rotation');

  // Clamp horizontal (yaw) to ±60°
  rotation.y = clamp(rotation.y, -60, 60);

  // Clamp vertical (pitch) to ±30°
  rotation.x = clamp(rotation.x, -30, 30);

  camera.setAttribute('rotation', rotation);
}

setInterval(updateRotation, 100);
