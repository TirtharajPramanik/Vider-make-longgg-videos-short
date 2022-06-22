input = document.querySelector('input');
dropbox = document.querySelector('.up');
upload = document.querySelector('.upload');

dropbox.addEventListener('click', () => {
	input.click();
});

upload.addEventListener('click', async () => {
	toast('File Sending...', 'up');
	input.disabled = true;
	upload.disabled = true;
	const file = input.files[0];
	const fileReader = new FileReader();
	if (!file) return;
	fileReader.readAsArrayBuffer(file);
	fileReader.onload = async (event) => {
		try {
			const content = event.target.result;
			const CHUNK_SIZE = 1000;
			const totalChunks = event.target.result.byteLength / CHUNK_SIZE;

			// generate a file name
			const fileName = Math.random().toString(36).slice(-6) + file.name;

			for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
				let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);

				await fetch('/upload?fileName=' + fileName, {
					method: 'POST',
					headers: {
						'content-type': 'application/octet-stream',
						'content-length': CHUNK.length,
					},
					body: CHUNK,
				});
			}

			const res = await fetch('/download?fileName=' + fileName);
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const down = document.createElement('a');
			down.style.display = 'none';
			down.href = url;
			// the filename you want
			down.download = `${fileName}.tar.gz`;
			down.click();
			window.URL.revokeObjectURL(url);
			input.disabled = false;
			upload.disabled = false;
		} catch (error) {
			console.error(error);
		}
	};
});

function toast(msg, grav) {
	Toastify({
		text: msg,
		duration: 3000,
		destination: 'https://github.com/apvarun/toastify-js',
		newWindow: true,
		close: true,
		gravity: grav, // `top` or `bottom`
		position: 'left', // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: 'linear-gradient(to right, #00b09b, #96c93d)',
		},
		// onClick: function () {}, // Callback after click
	}).showToast();
}
