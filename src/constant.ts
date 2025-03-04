

export const footerTemplate = `
<p style="color: #4E5774;margin-top: -50px;font-size: 10px;font-family:Open Sans;">Please note: Shelter placements and
  services are not guaranteed.</p>
`;

export const styles = `

* {
  font-family: 'Open Sans', sans-serif !important;
}

h1 {
  font-family: 'Montserrat', sans-serif !important;
}

h2 {
  font-family: 'Open Sans', sans-serif !important;
}


h3 {
  font-family: sans-serif !important;
}

p {
  font-family: "Open Sans", sans-serif !important;
  font-size: 13px;
  max-width: "40rem";
  text-wrap: balance;
}

.watermark {
  position: fixed;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  font-size: 120px;
  color: rgba(255, 0, 0, 0.035);
  font-weight: 800;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  letter-spacing: 8px;
}

.avoid-break {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  display: block;
  margin-bottom: 1rem;
}

`;
