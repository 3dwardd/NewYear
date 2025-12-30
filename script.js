const camera = document.querySelector('#camera');
const angleDisplay = document.getElementById('angleDisplay');

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateAngle() {
  let rotation = camera.getAttribute('rotation');

  // Wider clamp: allow -120° to +120° horizontally (240° total)
  rotation.y = clamp(rotation.y, -120, 120);

  // Allow -80° to +80° vertically (160° total)
  rotation.x = clamp(rotation.x, -80, 80);

  camera.setAttribute('rotation', rotation);

  const yaw = Math.round(rotation.y);
  angleDisplay.textContent = `Angle: ${yaw}°`;
}

setInterval(updateAngle, 100);
