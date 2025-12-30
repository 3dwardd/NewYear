const camera = document.querySelector('#camera');
const angleDisplay = document.getElementById('angleDisplay');

// Clamp helper
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateAngle() {
  let rotation = camera.getAttribute('rotation');

  // Clamp yaw (Y axis) to -90° to +90° → 180° total
  rotation.y = clamp(rotation.y, -90, 90);

  // Clamp pitch (X axis) to -90° to +90° → 180° total
  rotation.x = clamp(rotation.x, -90, 90);

  camera.setAttribute('rotation', rotation);

  const yaw = Math.round(rotation.y);
  angleDisplay.textContent = `Angle: ${yaw}°`;
}

// Update every 100ms
setInterval(updateAngle, 100);
