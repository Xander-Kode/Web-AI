VANTA.CLOUDS({
  el: '#vanta-hero',
  mouseControls: false,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  skyColor: 0x94c8e3,
  cloudColor: 0xd7d1d1,
  backgroundColor: 0xffffff
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
