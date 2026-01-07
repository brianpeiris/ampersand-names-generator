svgStyle.innerHTML = `
  @font-face {
    font-family: 'Ubuntu Sans';
    font-weight: 800;
    src: url("data:font/woff2;charset=utf-8;base64,${UBUNTU_SANS_800}");
  }
  @font-face {
    font-family: 'Inter';
    font-weight: 800;
    src: url("data:font/woff2;charset=utf-8;base64,${INTER_800}");
  }
`;

let names = input.value
	.trim()
	.split("\n")
	.map((n) => n.trim());
input.value = names.join("\n");

let width = 0;
let height = 0;
let fontFamily = document.querySelector("[name=font]:checked").value;
let color = document.querySelector("[name=color]:checked").value;
let generating = false;

function updateWidth() {
	let maxWidth = 0;
	document.querySelectorAll("tspan").forEach((tspan) => {
		const { width } = tspan.getClientRects()[0];
		if (width > maxWidth) maxWidth = width;
	});
	width = maxWidth;
	svg.setAttribute("viewBox", `0 0 ${maxWidth} ${height}`);
}

function generatePreview() {
	if (!generating) {
		downloadPng.removeAttribute("href");
	}
	names = input.value
		.trim()
		.split("\n")
		.map((n) => n.trim());

	fontFamily = document.querySelector("[name=font]:checked").value;

	color = document.querySelector("[name=color]:checked").value;

	const fontSize = 60;
	const lineHeight = Number(lineHeightEl.value);

	height = names.length * fontSize * lineHeight + 2 * lineHeight;
	svg.style.height = `${height}px`;

	Array.from(text.children).forEach((c) => text.removeChild(c));

	for (let i = 0; i < names.length; i++) {
		const name = names[i];
		const tspan = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"tspan",
		);
		tspan.setAttribute(
			"style",
			`
        fill: ${color.toLowerCase()};
        font-weight: 800;
        font-size: ${fontSize}px;
        font-family: '${fontFamily}';
      `,
		);
		tspan.setAttribute("x", 0);
		tspan.setAttribute("y", (i + 1) * fontSize * lineHeight);
		tspan.textContent = name + (i === names.length - 1 ? "." : "&");
		text.appendChild(tspan);
	}

	// Update width twice to account for re-layout
	updateWidth();
	updateWidth();
}

async function generateImages() {
	downloadPng.href = await convertSvgtoPngDataURL(
		svg,
		3000,
		3000 * (height / width),
	);

	const fileName = `Names-${names.join("-")}-${fontFamily.replace(" ", "-")}-${color}`;
	downloadPng.setAttribute("download", `${fileName}.png`);
}

generatePreview();

document.querySelectorAll("input, textarea").forEach((e) => {
	e.addEventListener("input", () => {
		generatePreview();
	});
});

generate.addEventListener("click", async () => {
	generate.textContent = "Generating...";
	generating = true;
	try {
		await generateImages();
	} catch (e) {
		alert(e);
	}
	generating = false;
	generate.textContent = "Generate Image";
});
