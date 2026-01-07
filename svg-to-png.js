// Source - https://stackoverflow.com/a/74026755
// Posted by Teocci, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-07, License - CC BY-SA 4.0
// Further modified here.

const loadImage = async (url) => {
	const img = document.createElement("img");
	img.src = url;
	return new Promise((resolve, reject) => {
		img.onload = () => resolve(img);
		img.onerror = reject;
	});
};

const serializeAsXML = (e) => new XMLSerializer().serializeToString(e);

const dataHeader = "data:image/svg+xml;charset=utf-8";
const encodeAsUTF8 = (s) => `${dataHeader},${encodeURIComponent(s)}`;

const getImageURL = async (svgURL, width, height) => {
	const img = await loadImage(svgURL);

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d").drawImage(img, 0, 0, width, height);

	return canvas.toDataURL(`image/png`);
};

function convertSvgtoPngDataURL(svg, width, height) {
	const svgURL = encodeAsUTF8(serializeAsXML(svg));
	return getImageURL(svgURL, width, height);
}
