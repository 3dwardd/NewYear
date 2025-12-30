const camera = document.querySelector('#camera');
const angleDisplay = document.getElementById('angleDisplay');

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateAngle() {
  let rotation = camera.getAttribute('rotation');

  // Clamp yaw (Y axis) to -60° to +60° → 120° total
  rotation.y = clamp(rotation.y, -60, 60);

  // Clamp pitch (X axis) to -40° to +40° → 80° total
  rotation.x = clamp(rotation.x, -40, 40);

  camera.setAttribute('rotation', rotation);

  const yaw = Math.round(rotation.y);
  angleDisplay.textContent = `Angle: ${yaw}°`;
}

setInterval(updateAngle, 100);
