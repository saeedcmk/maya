function downloadBlob(blob: Blob, options: { filename: string }) {
	const url = window.URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = options.filename;

	document.body.appendChild(a);
	a.click();
	a.remove();

	window.URL.revokeObjectURL(url);
}

export { downloadBlob };
