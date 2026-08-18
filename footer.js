document.addEventListener('DOMContentLoaded', async () => {
  const mount = document.querySelector('[data-site-footer]');
  if (!mount) return;
  try {
    const response = await fetch('/footer.html');
    if (!response.ok) throw new Error('Footer unavailable');
    mount.innerHTML = await response.text();
  } catch (error) {
    console.warn('BrightPathStudio footer could not be loaded.', error);
  }
});